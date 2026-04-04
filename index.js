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
      <a href="/api/jobs">Подивитися дані (JSON)</a>
    </div>
  `);
});

app.get('/api/jobs', (req, res) => {
  res.json(currentJobs);
});

// ==========================================
// 2. СТРОГИЙ ПАРСИНГ Work.ua (Тільки Вільногірськ)
// ==========================================
async function parseWorkUa() {
  try {
    // Параметр ?radius=0 забороняє шукати вакансії за межами міста (+0 км)
    const url = 'https://www.work.ua/jobs-vilnohirsk/?radius=0';
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const tempJobs = [];

    $('.card-hover, .job-link, .card.wordwrap').each((index, element) => {
      const titleElement = $(element).find('h2 a');
      const title = titleElement.text().trim();
      if (!title) return;

      let jobUrl = titleElement.attr('href');
      if (jobUrl && !jobUrl.startsWith('http')) jobUrl = 'https://www.work.ua' + jobUrl;
      
      let salary = 'Зарплата не вказана';
      const bText = $(element).find('b').text();
      if (bText.includes('грн') || bText.includes('₴')) {
          salary = $(element).find('b').first().text().replace(/\s+/g, ' ').trim();
      } else {
          const match = $(element).text().match(/[\d\s]+(грн|₴)/i);
          if (match) salary = match[0].trim();
      }
      
      let company = $(element).find('img[alt]').attr('alt') || $(element).find('span.strong-600').text().trim() || 'Work.ua';
      company = company.replace('Логотип компанії ', '').trim();
      
      let desc = $(element).find('p').text().trim();
      if (desc.length > 150) desc = desc.substring(0, 150) + '...';

      tempJobs.push({ title, salary, company, description: desc, date: "Work.ua", url: jobUrl });
    });
    return tempJobs;
  } catch (error) {
    console.error("Помилка Work.ua:", error.message);
    return [];
  }
}

// ==========================================
// 3. СТРОГИЙ ПАРСИНГ Robota.ua (Тільки Вільногірськ)
// ==========================================
async function parseRobotaUa() {
  try {
    const url = encodeURI('https://api.robota.ua/teleport/api/v1/vacancies/search?keyword=Вільногірськ');
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000
    });

    const tempJobs = [];
    if (response.data && Array.isArray(response.data.documents)) {
        response.data.documents.forEach(doc => {
            // Отримуємо офіційне місто з бази Robota.ua
            const cityName = (doc.cityName || (doc.city && doc.city.name) || '').toLowerCase().trim();
            
            // ЖОРСТКА ПЕРЕВІРКА: Якщо назва міста НЕ дорівнює "вільногірськ" або "вильногорск" - ігноруємо повністю
            if (cityName !== 'вільногірськ' && cityName !== 'вильногорск') {
                return; // ⛔ Блокуємо чужі міста!
            }

            let desc = doc.shortDescription || 'Деталі на сайті';
            desc = desc.replace(/<[^>]*>?/gm, '').trim();
            if (desc.length > 150) desc = desc.substring(0, 150) + '...';

            tempJobs.push({
                title: doc.name || 'Вакансія',
                salary: doc.salary ? `${doc.salary} грн` : 'Зарплата не вказана',
                company: doc.companyName || 'Robota.ua',
                description: desc,
                date: "Robota.ua",
                url: doc.id ? `https://robota.ua/vacancy${doc.id}` : 'https://robota.ua/zapros/робота/вільногірськ'
            });
        });
    }
    return tempJobs;
  } catch (error) {
    console.error("Помилка Robota.ua:", error.message);
    return [];
  }
}

// ==========================================
// 4. ГОЛОВНИЙ ПРОЦЕС
// ==========================================
async function fetchAllJobs() {
    console.log("Починаємо пошук вакансій...");
    const workJobs = await parseWorkUa();
    const robotaJobs = await parseRobotaUa();
    
    const allFound = [...workJobs, ...robotaJobs];
    
    if (allFound.length > 0) {
        currentJobs = allFound;
        console.log(`✅ Зібрано ${currentJobs.length} вакансій СУВОРО для Вільногірська`);
    } else {
        console.log("ℹ️ Вакансій не знайдено.");
    }
}

// ==========================================
// 5. ЗАПУСК СЕРВЕРА
// ==========================================
// Запускаємо сервер миттєво
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер Railway запущено на порту ${PORT}`);
  
  // Даємо Railway 2 секунди, щоб зрозуміти, що сервер увімкнувся, а потім тихо шукаємо вакансії
  setTimeout(() => {
    fetchAllJobs().catch(console.error);
  }, 2000);

  // Оновлюємо базу кожні 3 години
  setInterval(() => {
    fetchAllJobs().catch(console.error);
  }, 3 * 60 * 60 * 1000);
});

// Захист від падіння сервера
process.on('uncaughtException', err => console.error('Помилка:', err.message));
process.on('unhandledRejection', err => console.error('Помилка:', err));
