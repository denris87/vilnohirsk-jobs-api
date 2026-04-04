const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// --- АНТИ-КРАШ СИСТЕМА ---
// Ці дві функції не дають серверу "впасти" (Application failed to respond),
// якщо сталася якась непередбачувана помилка при парсингу сайтів.
process.on('uncaughtException', (err) => {
  console.error('Критична помилка (uncaughtException):', err.message);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Необроблена помилка промісу (unhandledRejection):', reason);
});
// -------------------------

// Тут ми будемо зберігати останні знайдені вакансії
let currentJobs = [];

// 1. Функція для парсингу Work.ua
async function parseWorkUa() {
  try {
    const url = 'https://www.work.ua/jobs-vilnohirsk/';
    // Маскуємось під робота Google, щоб уникнути блокування Cloudflare
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const tempJobs = [];

    $('.card-hover, .job-link, .card.wordwrap').each((index, element) => {
      const titleElement = $(element).find('h2 a');
      const title = titleElement.text().trim();
      let jobUrl = titleElement.attr('href');
      if (jobUrl && !jobUrl.startsWith('http')) jobUrl = 'https://www.work.ua' + jobUrl;
      
      let salary = 'Зарплата не вказана';
      const bText = $(element).find('b').text();
      if (bText.includes('грн') || bText.includes('₴')) {
          salary = $(element).find('b').first().text().replace(/\s+/g, ' ').trim();
      } else {
          const allText = $(element).text();
          const match = allText.match(/[\d\s]+(грн|₴)/i);
          if (match) salary = match[0].trim();
      }
      
      let company = $(element).find('img[alt]').attr('alt') || 
                    $(element).find('span.strong-600').text().trim() || 
                    $(element).find('.add-top-xs span b').text().trim() || 
                    'Work.ua';
      company = company.replace('Логотип компанії ', '').trim();
      
      let description = $(element).find('p').text().trim();
      if (description.length > 150) description = description.substring(0, 150) + '...';

      if (title && jobUrl) {
        tempJobs.push({ title, salary, company, description, date: "Work.ua", url: jobUrl });
      }
    });
    return tempJobs;
  } catch (error) {
    console.error("Помилка парсингу Work.ua (можливо заблокував захист):", error.message);
    return []; // Повертаємо пустий масив, але не "вбиваємо" сервер
  }
}

// 2. Функція для парсингу Robota.ua (ОФІЦІЙНЕ ВІДКРИТЕ API)
async function parseRobotaUa() {
  try {
    const url = encodeURI('https://api.robota.ua/teleport/api/v1/vacancies/search?keyword=Вільногірськ');
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 15000
    });

    const tempJobs = [];
    if (response.data && Array.isArray(response.data.documents)) {
        response.data.documents.forEach(doc => {
            let desc = doc.shortDescription || 'Деталі на сайті';
            // Очищаємо опис від HTML-тегів, якщо вони є
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
    console.error("Помилка парсингу Robota.ua:", error.message);
    return [];
  }
}

// 3. Головна функція збору даних
async function fetchAllJobs() {
    console.log("Починаємо збір вакансій з усіх сайтів...");
    const workJobs = await parseWorkUa();
    const robotaJobs = await parseRobotaUa();
    
    // Об'єднуємо вакансії з двох сайтів
    const allFound = [...workJobs, ...robotaJobs];
    
    if (allFound.length > 0) {
        currentJobs = allFound;
        console.log(`✅ Зібрано ${currentJobs.length} вакансій (Work.ua: ${workJobs.length}, Robota.ua: ${robotaJobs.length})`);
    } else {
        console.log("ℹ️ Нових вакансій не знайдено (можливо сайти тимчасово заблокували доступ). Залишаємо старі дані в пам'яті.");
    }
}

// Головний API-маршрут для додатку
app.get('/api/jobs', (req, res) => res.json(currentJobs));

// Маршрут-пінг для перевірки працездатності (Healthcheck)
app.get('/ping', (req, res) => res.send('pong'));

// Головна сторінка сервера
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний</b></p>
      <p>У базі зараз: <b>${currentJobs.length}</b> вакансій.</p>
      <p>Джерела: <b>Work.ua, Robota.ua</b></p>
      <a href="/api/jobs" style="display: inline-block; padding: 10px 15px; background: #00b8ff; color: white; text-decoration: none; border-radius: 8px;">Переглянути дані (JSON)</a>
    </div>
  `);
});

// Запуск сервера із прив'язкою до 0.0.0.0 (вимога хмарних хостингів, як Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер успішно працює на порту ${PORT}`);
  
  // Збираємо вакансії через 3 секунди після запуску сервера
  setTimeout(fetchAllJobs, 3000);
  
  // Далі оновлюємо дані кожні 3 години
  setInterval(fetchAllJobs, 3 * 60 * 60 * 1000);
});
