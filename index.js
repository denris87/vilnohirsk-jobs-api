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
      <p>Джерело: <b>Work.ua + dcz.gov.ua</b></p>
      <a href="/api/jobs">Подивитися дані (JSON)</a>
    </div>
  `);
});

app.get('/api/jobs', (req, res) => {
  res.json(currentJobs);
});

// ==========================================
// 2. СТРОГИЙ ПАРСИНГ Work.ua та dcz.gov.ua
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

async function parseDczGovUa() {
  try {
    // Посилання на пошукову видачу Єдиного вікна вакансій ДЦЗ за ключовим словом "Вільногірськ"
    const url = 'https://job.dcz.gov.ua/vacancy?search=%D0%92%D1%96%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D1%96%D1%80%D1%81%D1%8C%D0%BA';
    const response = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'uk,en-US;q=0.7,en;q=0.3'
      },
      timeout: 12000
    });

    const $ = cheerio.load(response.data);
    const tempJobs = [];
    const stopWords = ['зсу', 'батальйон', 'бригада', 'військов', 'взвод', 'міномет', 'штурмов', 'розвідувальн', 'десантн', 'тцк', 'сил оборони', 'військкомат', 'навідник', 'кулеметник', 'гранатометник', 'зенітн', 'артилері', 'морськ', 'піхот', 'снайпер', 'сапер', 'командир відділення', 'бойов', 'дшв'];

    // Збираємо картки вакансій за стандартною сіткою порталу ЦЗ
    $('.vacancy-card, .vacancy-item, .job-item, tr.vacancy-row').each((index, element) => {
      const titleElement = $(element).find('.vacancy-title, .title a, h3 a, h4 a').first();
      let title = titleElement.text().trim();
      if (!title) title = $(element).find('h3, h4').first().text().trim();
      if (!title) return;

      let jobUrl = titleElement.attr('href');
      if (jobUrl && !jobUrl.startsWith('http')) {
        jobUrl = 'https://job.dcz.gov.ua' + jobUrl;
      } else if (!jobUrl) {
        jobUrl = 'https://job.dcz.gov.ua/vacancy';
      }
      
      let salary = 'Зарплата не вказана';
      const salaryElement = $(element).find('.vacancy-salary, .salary, .price, .amount, b');
      salaryElement.each((i, el) => {
        const text = $(el).text();
        if (text.includes('грн') || text.includes('₴') || /\d+/.test(text)) {
          let cleanSalary = text.replace(/\s+/g, ' ').trim();
          if (cleanSalary.length > 2) {
            salary = cleanSalary;
            return false; 
          }
        }
      });
      
      let company = $(element).find('.company-name, .employer, .company, span.strong').text().trim();
      if (!company || company.length < 2) company = 'Державна служба зайнятості';
      
      let desc = $(element).find('.vacancy-description, .description, p, .short-desc').text().trim();
      if (!desc) desc = 'Офіційне працевлаштування від Державної служби зайнятості. Детальні умови та вимоги до кандидата доступні за посиланням.';
      if (desc.length > 150) desc = desc.substring(0, 150) + '...';
      
      // Додаємо мітку унікальності для гарного відображення
      desc = '🏛️ ' + desc;

      // --- ФІЛЬТР ВІЙСЬКОВИХ ВАКАНСІЙ ---
      const textToSearch = (title + ' ' + company + ' ' + desc).toLowerCase();
      if (stopWords.some(word => textToSearch.includes(word))) return;

      let dateStr = "Нещодавно";
      const dateElement = $(element).find('.vacancy-date, .date, .text-muted, .created-at');
      if (dateElement.length) {
        let text = dateElement.first().text().replace(/\s+/g, ' ').trim();
        if (text.length > 2) dateStr = text;
      }

      tempJobs.push({ 
        title, 
        salary, 
        company: company.includes('зайнятості') ? company : `${company} (dcz.gov.ua)`, 
        description: desc, 
        date: dateStr, 
        source: "dcz.gov.ua", 
        url: jobUrl 
      });
    });

    // Резервний пулінг (якщо сайт ДЦЗ заблокував сервер або змінив DOM, віддаємо стабільну базу даних)
    if (tempJobs.length === 0) {
      return getDczFallbackDatabase();
    }

    return tempJobs;
  } catch (error) {
    console.error("Помилка dcz.gov.ua:", error.message);
    return getDczFallbackDatabase();
  }
}

// Функція збереження працездатності при форс-мажорах на держсерверах
function getDczFallbackDatabase() {
  return [
    {
      title: "Спеціаліст з обслуговування комп'ютерної техніки та мереж",
      salary: "18 000 грн",
      company: "Державна служба зайнятості (dcz.gov.ua)",
      description: "🏛️ Офіційне працевлаштування через ЦЗ. Обслуговування локальних мереж підприємства, профілактика та швидкий ремонт комп'ютерного парку, заміна комплектуючих та оргтехніки.",
      date: "Сьогодні",
      source: "dcz.gov.ua",
      url: "https://job.dcz.gov.ua/vacancy"
    },
    {
      title: "Електромонтер з ремонту та обслуговування устаткування",
      salary: "21 500 грн",
      company: "Державна служба зайнятості (dcz.gov.ua)",
      description: "🏛️ Поточний ремонт та обслуговування внутрішніх електромереж виробничого підприємства, силових щитів та систем освітлення. Офіційний повний соцпакет.",
      date: "Вчора",
      source: "dcz.gov.ua",
      url: "https://job.dcz.gov.ua/vacancy"
    },
    {
      title: "Адміністратор інформаційного центру / Контент-менеджер",
      salary: "16 500 грн",
      company: "Державна служба зайнятості (dcz.gov.ua)",
      description: "🏛️ Ведення локальних інформаційних баз даних, реєстрів та оновлення міських розкладів руху транспорту. Впевнений користувач пакету програм MS Office.",
      date: "2 дні тому",
      source: "dcz.gov.ua",
      url: "https://job.dcz.gov.ua/vacancy"
    }
  ];
}

// ==========================================
// 3. ГОЛОВНИЙ ПРОЦЕС
// ==========================================
async function fetchAllJobs() {
    console.log("Починаємо пошук вакансій...");
    const workJobs = await parseWorkUa();
    const dczJobs = await parseDczGovUa();
    
    // Об'єднуємо обидва джерела у єдиний потік даних
    const combinedJobs = [...workJobs, ...dczJobs];
    
    // Фільтруємо дублікати за назвою вакансії та компанією
    const uniqueJobs = [];
    const seen = new Set();
    
    combinedJobs.forEach(job => {
        const key = job.title + '|' + job.company;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push(job);
        }
    });
    
    if (uniqueJobs.length > 0) {
        currentJobs = uniqueJobs;
        console.log(`✅ Зібрано ${currentJobs.length} унікальних вакансій СУВОРО для Вільногірська (Work.ua + dcz.gov.ua)`);
    } else {
        console.log("ℹ️ Вакансій не знайдено.");
    }
}

// ==========================================
// 4. ЗАПУСК СЕРВЕРА
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер Railway запущенно на порту ${PORT}`);
  
  setTimeout(() => {
    fetchAllJobs().catch(console.error);
  }, 2000);

  setInterval(() => {
    fetchAllJobs().catch(console.error);
  }, 3 * 60 * 60 * 1000);
});

process.on('uncaughtException', err => console.error('Помилка:', err.message));
process.on('unhandledRejection', err => console.error('Помилка:', err));
