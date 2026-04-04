const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Тут ми будемо зберігати останні знайдені вакансії
let currentJobs = [];

// ==========================================
// 1. ШВИДКІ МАРШРУТИ (Щоб Railway не блокував сервер)
// ==========================================
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний і працює!</b></p>
      <p>Вакансій у базі: <b>${currentJobs.length}</b> (СУВОРО ВІЛЬНОГІРСЬК)</p>
      <p>Джерело: <b>dcz.gov.ua (Центр Зайнятості)</b></p>
      <a href="/api/jobs">Подивитися дані (JSON)</a>
    </div>
  `);
});

app.get('/api/jobs', (req, res) => {
  res.json(currentJobs);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// ==========================================
// 2. СТРОГИЙ ПАРСИНГ Центру Зайнятості (dcz.gov.ua)
// ==========================================
async function parseDczUa() {
  try {
    // Формуємо URL для пошуку вакансій саме у Вільногірську
    const url = encodeURI('https://jobportal.dcz.gov.ua/search?region=Вільногірськ');
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const tempJobs = [];

    // Шукаємо картки вакансій на порталі ДЦЗ
    $('.job-card, .vacancy-card, .card, .vacancy-item').each((index, element) => {
        const titleElement = $(element).find('h3, h2, .title, .job-title').first();
        const title = titleElement.text().trim();
        if (!title) return;

        let jobUrl = $(element).find('a').attr('href') || url;
        if (jobUrl && !jobUrl.startsWith('http')) jobUrl = 'https://jobportal.dcz.gov.ua' + jobUrl;

        let salary = $(element).find('.salary, .price').text().replace(/\s+/g, ' ').trim() || 'Зарплата не вказана';
        let company = $(element).find('.company, .employer').text().trim() || 'Державний Центр Зайнятості';
        
        let desc = $(element).find('.description, p').text().trim() || 'Деталі на сайті ДЦЗ';
        if (desc.length > 150) desc = desc.substring(0, 150) + '...';

        // Жорстка перевірка: пропускаємо лише якщо в тексті є згадка про Вільногірськ
        const textContent = $(element).text().toLowerCase();
        if (textContent.includes('вільногірськ') || textContent.includes('вильногорск')) {
            tempJobs.push({
                title: title,
                salary: salary,
                company: company,
                description: desc,
                date: "dcz.gov.ua", // <--- Фронтенд розпізнає це джерело
                url: jobUrl
            });
        }
    });
    return tempJobs;
  } catch (error) {
    console.error("Помилка DCZ:", error.message);
    return [];
  }
}

// ==========================================
// 3. ГОЛОВНИЙ ПРОЦЕС
// ==========================================
async function fetchAllJobs() {
    console.log("Починаємо пошук вакансій з dcz.gov.ua...");
    const dczJobs = await parseDczUa();
    
    if (dczJobs.length > 0) {
        currentJobs = dczJobs;
        console.log(`✅ Зібрано ${currentJobs.length} вакансій СУВОРО для Вільногірська з Центру Зайнятості`);
    } else {
        console.log("ℹ️ Вакансій не знайдено.");
    }
}

// ==========================================
// 4. ЗАПУСК СЕРВЕРА
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер Railway запущено на порту ${PORT}`);
  
  // Запускаємо пошук через 2 секунди
  setTimeout(() => {
    fetchAllJobs().catch(console.error);
  }, 2000);

  // Оновлюємо кожні 3 години
  setInterval(() => {
    fetchAllJobs().catch(console.error);
  }, 3 * 60 * 60 * 1000);
});

// Захист від падіння сервера
process.on('uncaughtException', err => console.error('Помилка:', err.message));
process.on('unhandledRejection', err => console.error('Помилка:', err));
