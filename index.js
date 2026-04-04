const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Тут ми будемо зберігати останні знайдені вакансії
let currentJobs = [];

// Базові маршрути (відповідають миттєво)
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний і працює!</b></p>
      <p>Вакансій у базі: <b>${currentJobs.length}</b></p>
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

// Запуск сервера (найпростіший і надійний метод для Railway)
app.listen(PORT, () => {
  console.log(`✅ Сервер успішно запущено на порту ${PORT}`);
  
  // Відкладаємо парсинг на 10 секунд
  setTimeout(() => {
    fetchAllJobs().catch(console.error);
  }, 10000);

  // Оновлюємо кожні 3 години
  setInterval(() => {
    fetchAllJobs().catch(console.error);
  }, 3 * 60 * 60 * 1000);
});

// Анти-краш
process.on('uncaughtException', err => console.error('Критична помилка:', err));
process.on('unhandledRejection', err => console.error('Помилка промісу:', err));

// --- ЛОГІКА ПАРСИНГУ ---

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
    console.log("Починаємо збір вакансій...");
    const workJobs = await parseWorkUa();
    const robotaJobs = await parseRobotaUa();
    
    const allFound = [...workJobs, ...robotaJobs];
    
    if (allFound.length > 0) {
        currentJobs = allFound;
        console.log(`✅ Зібрано ${currentJobs.length} вакансій`);
    } else {
        console.log("ℹ️ Нових вакансій не знайдено.");
    }
}
