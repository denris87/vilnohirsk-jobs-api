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
// 1. ШВИДКІ МАРШРУТИ
// ==========================================
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний і працює!</b></p>
      <p>Вакансій у базі: <b>${currentJobs.length}</b> (СУВОРО ВІЛЬНОГІРСЬК)</p>
      <p>Джерело: <b>Work.ua</b></p>
      <a href="/api/jobs">Подивитися дані (JSON)</a>
    </div>
  `);
});

app.get('/api/jobs', (req, res) => {
  res.json(currentJobs);
});

// ==========================================
// 2. СТРОГИЙ ПАРСИНГ Work.ua
// ==========================================
async function parseWorkUa() {
  try {
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
      
      let company = $(element).find('img[alt]').attr('alt') || $(element).find('span.strong-600').text().trim() || 'Компанія не вказана';
      company = company.replace('Логотип компанії ', '').trim();
      
      let desc = $(element).find('p').text().trim();
      if (desc.length > 150) desc = desc.substring(0, 150) + '...';

      // --- ФІЛЬТР ВІЙСЬКОВИХ ВАКАНСІЙ ---
      const textToSearch = (title + ' ' + company + ' ' + desc).toLowerCase();
      const stopWords = ['зсу', 'батальйон', 'бригада', 'військов', 'взвод', 'міномет', 'штурмов', 'розвідувальн', 'десантн', 'тцк', 'сил оборони', 'військкомат', 'навідник', 'кулеметник', 'гранатометник', 'зенітн', 'артилері', 'морськ', 'піхот', 'снайпер', 'сапер', 'командир відділення', 'бойов', 'дшв'];
      if (stopWords.some(word => textToSearch.includes(word))) {
          return; // Пропускаємо цю вакансію і не зберігаємо її
      }

      // Шукаємо справжню дату (зазвичай вона сіра, у класі text-muted)
      let dateStr = "Нещодавно";
      $(element).find('.text-muted').each((i, el) => {
          let text = $(el).text().replace(/\s+/g, ' ').trim();
          if (text && !text.includes('Відгукнутись') && !text.includes('Зберегти')) {
              dateStr = text;
          }
      });

      tempJobs.push({ title, salary, company, description: desc, date: dateStr, source: "Work.ua", url: jobUrl });
    });
    return tempJobs;
  } catch (error) {
    console.error("Помилка Work.ua:", error.message);
    return [];
  }
}

// ==========================================
// 3. ГОЛОВНИЙ ПРОЦЕС
// ==========================================
async function fetchAllJobs() {
    console.log("Починаємо пошук вакансій...");
    const workJobs = await parseWorkUa();
    
    // Фільтруємо дублікати за назвою вакансії та компанією
    const uniqueJobs = [];
    const seen = new Set();
    
    workJobs.forEach(job => {
        const key = job.title + '|' + job.company;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push(job);
        }
    });
    
    if (uniqueJobs.length > 0) {
        currentJobs = uniqueJobs;
        console.log(`✅ Зібрано ${currentJobs.length} унікальних вакансій СУВОРО для Вільногірська (Тільки Work.ua)`);
    } else {
        console.log("ℹ️ Вакансій не знайдено.");
    }
}

// ==========================================
// 4. ЗАПУСК СЕРВЕРА
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер Railway запущено на порту ${PORT}`);
  
  setTimeout(() => {
    fetchAllJobs().catch(console.error);
  }, 2000);

  setInterval(() => {
    fetchAllJobs().catch(console.error);
  }, 3 * 60 * 60 * 1000);
});

process.on('uncaughtException', err => console.error('Помилка:', err.message));
process.on('unhandledRejection', err => console.error('Помилка:', err));
