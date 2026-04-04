const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Тут ми будемо зберігати останні знайдені вакансії
let currentJobs = [];

// 1. Функція для парсингу Work.ua
async function parseWorkUa() {
  try {
    const url = 'https://www.work.ua/jobs-vilnohirsk/';
    // Маскуємось під робота Google (Cloudflare пропускає пошуковики)
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
    console.error("Помилка Work.ua:", error.message);
    return [];
  }
}

// 2. Функція для парсингу Robota.ua (офіційне відкрите API)
async function parseRobotaUa() {
  try {
    const url = encodeURI('https://api.robota.ua/teleport/api/v1/vacancies/search?keyword=Вільногірськ');
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000
    });

    const tempJobs = [];
    if (response.data && response.data.documents) {
        response.data.documents.forEach(doc => {
            tempJobs.push({
                title: doc.name || 'Вакансія',
                salary: doc.salary ? `${doc.salary} грн` : 'Зарплата не вказана',
                company: doc.companyName || 'Robota.ua',
                description: doc.shortDescription ? doc.shortDescription.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'Деталі на сайті',
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

// 3. Головна функція збору даних
async function fetchAllJobs() {
    console.log("Починаємо збір вакансій...");
    const workJobs = await parseWorkUa();
    const robotaJobs = await parseRobotaUa();
    
    // Об'єднуємо вакансії з двох сайтів
    const allFound = [...workJobs, ...robotaJobs];
    
    if (allFound.length > 0) {
        currentJobs = allFound;
        console.log(`✅ Зібрано ${currentJobs.length} вакансій (Work.ua: ${workJobs.length}, Robota.ua: ${robotaJobs.length})`);
    } else {
        console.log("ℹ️ Нових вакансій не знайдено. Залишаємо старі дані.");
    }
}

app.get('/api/jobs', (req, res) => res.json(currentJobs));

app.get('/', (req, res) => {
  res.send(`
    <h1>Smart Vilnohirsk Jobs Parser 🚀</h1>
    <p>У базі: <b>${currentJobs.length}</b> вакансій.</p>
    <p>Джерела: Work.ua, Robota.ua</p>
    <a href="/api/jobs">Подивитися дані (JSON)</a>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер успішно працює на порту ${PORT}`);
  
  // ВАЖЛИВО: Запускаємо парсинг через 5 секунд ПІСЛЯ старту сервера, 
  // щоб Railway встиг побачити, що додаток "живий", і не видавав помилку "failed to respond".
  setTimeout(fetchAllJobs, 5000);
  
  // Далі оновлюємо дані кожні 3 години
  setInterval(fetchAllJobs, 3 * 60 * 60 * 1000);
});
