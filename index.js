const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Тут ми будемо зберігати останні знайдені вакансії
let currentJobs = [];

// Функція-робот, яка йде на сайт і читає його
async function parseWorkUa() {
  try {
    console.log("Починаємо збір вакансій з сайту Work.ua...");
    
    // URL для пошуку вакансій у Вільногірську
    const url = 'https://www.work.ua/jobs-vilnohirsk/';

    // МАКСИМАЛЬНА МАСКУВАННЯ ПІД РЕАЛЬНИЙ БРАУЗЕР (щоб не заблокував Cloudflare)
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'uk-UA,uk;q=0.9,ru-RU;q=0.8,ru;q=0.7,en-US;q=0.6,en;q=0.5',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 20000 // Чекаємо до 20 секунд
    });

    const $ = cheerio.load(response.data);
    const tempJobs = [];

    // Шукаємо картки вакансій по різних можливих класах (Work.ua часто їх змінює)
    const cards = $('.card-hover, .job-link, .card.wordwrap');

    if (cards.length === 0) {
       console.log("❌ Увага: Картки не знайдені. Можливо, Work.ua показав капчу (Cloudflare) або змінив верстку.");
    }

    cards.each((index, element) => {
      const titleElement = $(element).find('h2 a');
      const title = titleElement.text().trim();
      
      let jobUrl = titleElement.attr('href');
      if (jobUrl && !jobUrl.startsWith('http')) {
         jobUrl = 'https://www.work.ua' + jobUrl;
      }
      
      // Розумний пошук зарплати
      let salary = 'Зарплата не вказана';
      const bText = $(element).find('b').text();
      if (bText.includes('грн') || bText.includes('₴')) {
          salary = $(element).find('b').first().text().replace(/\s+/g, ' ').trim();
      } else {
          // Якщо зарплата не в тегу <b>, шукаємо просто текст з "грн"
          const allText = $(element).text();
          const match = allText.match(/[\d\s]+(грн|₴)/i);
          if (match) {
             salary = match[0].trim();
          }
      }
      
      // Розумний пошук компанії
      let company = $(element).find('img[alt]').attr('alt') || 
                    $(element).find('span.strong-600').text().trim() || 
                    $(element).find('.add-top-xs span b').text().trim() || 
                    'Роботодавець з Work.ua';
                    
      company = company.replace('Логотип компанії ', '').trim();
      
      // Шукаємо короткий опис (перший параграф)
      let description = $(element).find('p').text().trim();
      if (description.length > 150) description = description.substring(0, 150) + '...';

      // Якщо знайшли заголовок, додаємо в список
      if (title && jobUrl) {
        tempJobs.push({
          title: title,
          salary: salary,
          company: company,
          description: description,
          date: "Work.ua", // Помітка, звідки вакансія
          url: jobUrl
        });
      }
    });

    // Оновлюємо наш головний список, ТІЛЬКИ якщо щось знайшли (щоб не стерти старі дані при тимчасовому блокуванні)
    if (tempJobs.length > 0) {
      currentJobs = tempJobs;
      console.log(`✅ Успішно зібрано ${currentJobs.length} вакансій з Work.ua!`);
    } else {
      console.log("ℹ️ Вакансій 0. Залишаємо попередні збережені дані.");
    }
  } catch (error) {
    console.error("❌ Помилка парсингу (можливо заблокував Cloudflare):", error.message);
  }
}

// API, до якого звертається ваш додаток у Telegram
app.get('/api/jobs', (req, res) => {
  res.json(currentJobs);
});

// Головна сторінка сервера
app.get('/', (req, res) => {
  res.send(`
    <h1>Vilnohirsk Jobs Auto-Parser is Running! 🚀</h1>
    <p>Зараз в базі: <b>${currentJobs.length}</b> вакансій з Work.ua</p>
    <a href="/api/jobs">Подивитися сирі дані (JSON)</a>
  `);
});

// Запуск сервера із явною прив'язкою до 0.0.0.0 для Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер успішно запущено на порту ${PORT}`);
  
  // Запускаємо парсер ТІЛЬКИ ПІСЛЯ успішного старту сервера
  parseWorkUa();

  // Далі налаштовуємо робота автоматично збирати дані кожні 3 години
  setInterval(parseWorkUa, 3 * 60 * 60 * 1000);
});
