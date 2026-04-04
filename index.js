const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
// Railway автоматично передає порт. Якщо його немає (наприклад, на вашому ПК), беремо 3000
const PORT = process.env.PORT || 3000;

app.use(cors());

// Тут ми будемо зберігати останні знайдені вакансії
let currentJobs = [];

// ==========================================
// 1. МАРШРУТИ СЕРВЕРА (Мають відповідати миттєво!)
// ==========================================
app.get('/api/jobs', (req, res) => {
  res.json(currentJobs);
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/', (req, res) => {
  res.status(200).send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний</b></p>
      <p>У базі зараз: <b>${currentJobs.length}</b> вакансій.</p>
      <p>Джерела: <b>Work.ua, Robota.ua</b></p>
      <a href="/api/jobs" style="display: inline-block; padding: 10px 15px; background: #00b8ff; color: white; text-decoration: none; border-radius: 8px;">Переглянути дані (JSON)</a>
    </div>
  `);
});

// ==========================================
// 2. ЗАПУСК СЕРВЕРА (Робіть це ДО парсингу)
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер успішно запущено на порту ${PORT}`);
  
  // Відкладаємо перший парсинг на 15 секунд, щоб Railway гарантовано зафіксував запуск!
  setTimeout(() => {
    fetchAllJobs().catch(console.error);
  }, 15000);

  // Далі оновлюємо дані кожні 3 години
  setInterval(() => {
    fetchAllJobs().catch(console.error);
  }, 3 * 60 * 60 * 1000);
});

// Глобальний захист від падінь (анти-краш)
process.on('uncaughtException', (err) => {
  console.error('Критична помилка:', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('Помилка промісу:', err);
});

// ==========================================
// 3. ФУНКЦІЇ ЗБОРУ ВАКАНСІЙ (Працюють у фоні)
// ==========================================
async function parseWorkUa() {
  try {
    const url = 'https://www.work.ua/jobs-vilnohirsk/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
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
          const match = $(element).text().match(/[\d\s]+(грн|₴)/i);
          if (match) salary = match[0].trim();
      }
      
      let company = $(element).find('img[alt]').attr('alt') || $(element).find('span.strong-600').text().trim() || 'Work.ua';
      company = company.replace('Логотип компанії ', '').trim();
      
      let desc = $(element).find('p').text().trim();
      if (desc.length > 150) desc = desc.substring(0, 150) + '...';

      if (title && jobUrl) {
        tempJobs.push({ title, salary, company, description: desc, date: "Work.ua", url: jobUrl });
      }
    });
    return tempJobs;
  } catch (error) {
    console.error("Помилка Work.ua:", error.message);
    return [];
  }
}

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

async function fetchAllJobs() {
    console.log("Починаємо збір вакансій з сайтів...");
    const workJobs = await parseWorkUa();
    const robotaJobs = await parseRobotaUa();
    
    const allFound = [...workJobs, ...robotaJobs];
    
    if (allFound.length > 0) {
        currentJobs = allFound;
        console.log(`✅ Зібрано ${currentJobs.length} вакансій (Work.ua: ${workJobs.length}, Robota.ua: ${robotaJobs.length})`);
    } else {
        console.log("ℹ️ Нових вакансій не знайдено. Залишаємо старі дані.");
    }
}
