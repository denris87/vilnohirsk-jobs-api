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
    console.log("Починаємо збір вакансій з сайту...");
    
    // URL для пошуку вакансій у Вільногірську на Work.ua
    const url = 'https://www.work.ua/jobs-vilnohirsk/';

    // Прикидаємося звичайним браузером, щоб нас не заблокували
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const tempJobs = [];

    // Шукаємо всі картки вакансій на сторінці (на Work.ua вони мають клас .card-hover)
    $('.card-hover').each((index, element) => {
      const titleElement = $(element).find('h2 a');
      const title = titleElement.text().trim();
      const jobUrl = 'https://www.work.ua' + titleElement.attr('href');
      
      // Шукаємо зарплату (зазвичай вона виділена жирним тегом <b>)
      let salary = $(element).find('b').first().text().trim();
      // Якщо в тексті немає слова 'грн', значить ми захопили щось інше, ставимо 'Не вказано'
      if (!salary.includes('грн') && !salary.includes('₴')) {
          salary = 'Зарплата не вказана';
      }
      
      // Шукаємо компанію
      let company = $(element).find('span.strong-600').text().trim() || $(element).find('.add-top-xs span b').text().trim();
      if (!company) company = 'Роботодавець з Work.ua';
      
      // Шукаємо короткий опис (перший параграф)
      let description = $(element).find('p').text().trim();
      // Обрізаємо занадто довгий опис
      if (description.length > 150) description = description.substring(0, 150) + '...';

      // Якщо знайшли заголовок і це точно посилання на вакансію, додаємо в список
      if (title && jobUrl.includes('/jobs/')) {
        tempJobs.push({
          title: title,
          salary: salary,
          company: company,
          description: description,
          date: "Work.ua",
          url: jobUrl // Посилання на сам сайт Work.ua
        });
      }
    });

    // Якщо ми успішно щось знайшли, оновлюємо наш головний список
    if (tempJobs.length > 0) {
      currentJobs = tempJobs;
      console.log(`Успішно зібрано ${currentJobs.length} вакансій з Work.ua!`);
    } else {
      console.log("Вакансій не знайдено (можливо Work.ua змінив дизайн).");
    }
  } catch (error) {
    console.error("Помилка парсингу (можливо сайт блокує запит):", error.message);
  }
}

// Запускаємо робота один раз при включенні сервера
parseWorkUa();

// Далі налаштовуємо робота автоматично збирати дані кожні 6 годин (6 * 60 * 60 * 1000 мілісекунд)
setInterval(parseWorkUa, 6 * 60 * 60 * 1000);

// API, до якого звертається ваш додаток у Telegram
app.get('/api/jobs', (req, res) => {
  // Просто віддаємо те, що зберіг робот
  res.json(currentJobs);
});

// Головна сторінка сервера
app.get('/', (req, res) => {
  res.send('Vilnohirsk Jobs Auto-Parser is Running! 🚀');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}`);
});
