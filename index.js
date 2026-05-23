const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let currentJobs = [];

// ==========================================
// 1. ШВИДКІ МАРШРУТИ
// ==========================================
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний і працює!</b></p>
      <p>Вакансій у базі: <b>${currentJobs.length}</b></p>
      <p>Джерела: <b>Work.ua + ДЦЗ</b></p>
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

      const textToSearch = (title + ' ' + company + ' ' + desc).toLowerCase();
      const stopWords = ['зсу', 'батальйон', 'бригада', 'військов', 'взвод', 'міномет', 'штурмов', 'розвідувальн', 'десантн', 'тцк', 'сил оборони', 'військкомат', 'навідник', 'кулеметник', 'гранатометник', 'зенітн', 'артилері', 'морськ', 'піхот', 'снайпер', 'сапер', 'командир відділення', 'бойов', 'дшв'];
      if (stopWords.some(word => textToSearch.includes(word))) return;

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
// 3. ВАКАНСІЇ ДЦЗ (YAML)
// ==========================================
function loadDczJobs() {
  try {
    const yamlPath = path.join(__dirname, 'dcz_jobs.yaml');
    if (!fs.existsSync(yamlPath)) {
      console.log('ℹ️ Файл dcz_jobs.yaml не знайдено — пропускаємо ДЦЗ');
      return [];
    }
    const fileContent = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContent);
    if (!data || !Array.isArray(data.jobs)) return [];

    return data.jobs.map(item => {
      const phone = String(item.phone || '').trim();
      const employment = item.employment_type ? `${item.employment_type[0].toUpperCase()}${item.employment_type.slice(1)}` : 'Повна';

      let desc = String(item.description || '').trim();
      if (item.requirements) {
        const r = item.requirements;
        const reqLines = [];
        if (r.education) reqLines.push(`Освіта: ${r.education}`);
        if (r.experience) reqLines.push(`Досвід: ${r.experience}`);
        if (r.professional_competencies) reqLines.push(`Вимоги: ${r.professional_competencies}`);
        if (reqLines.length) desc += `\n\n${reqLines.join('\n')}`;
      }
      if (item.work_schedule) desc += `\n\nГрафік: ${item.work_schedule}`;
      if (item.work_nature) desc += `\nХарактер: ${item.work_nature}`;
      if (item.working_conditions) desc += `\nУмови: ${item.working_conditions}`;
      if (item.social_benefits) desc += `\nСоцпакет: ${item.social_benefits}`;
      if (item.accessible_for_disabled) desc += `\n♿ Доступна для людей з інвалідністю`;
      if (item.vacancy_number) desc += `\n\n№ вакансії: ${item.vacancy_number}`;

      return {
        title: item.title,
        company: item.employer || 'Не вказано',
        salary: item.salary || '-',
        description: desc.trim(),
        date: item.date_posted || 'Нещодавно',
        source: 'ДЦЗ',
        url: phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#',
        phone: phone,
        employment: employment
      };
    });
  } catch (error) {
    console.error('❌ Помилка читання dcz_jobs.yaml:', error.message);
    return [];
  }
}

// ==========================================
// 4. ГОЛОВНИЙ ПРОЦЕС
// ==========================================
async function fetchAllJobs() {
    console.log("Починаємо пошук вакансій...");
    const workJobs = await parseWorkUa();
    const dczJobs = loadDczJobs();
    const allJobs = [...dczJobs, ...workJobs];

    const uniqueJobs = [];
    const seen = new Set();

    allJobs.forEach(job => {
        const key = job.title + '|' + job.company;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push(job);
        }
    });

    if (uniqueJobs.length > 0) {
        currentJobs = uniqueJobs;
        console.log(`✅ ${currentJobs.length} унікальних вакансій (Work.ua: ${workJobs.length}, ДЦЗ: ${dczJobs.length})`);
    } else {
        console.log("ℹ️ Вакансій не знайдено.");
    }
}

// ==========================================
// 5. ЗАПУСК СЕРВЕРА
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер Railway запущено на порту ${PORT}`);

  setTimeout(() => fetchAllJobs().catch(console.error), 2000);
  setInterval(() => fetchAllJobs().catch(console.error), 3 * 60 * 60 * 1000);
});

process.on('uncaughtException', err => console.error('Помилка:', err.message));
process.on('unhandledRejection', err => console.error('Помилка:', err));
