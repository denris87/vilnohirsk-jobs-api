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

// === Налаштування ===
// URL YAML-файлу на GitHub raw. Зміни тут гілку чи шлях, якщо репо інше.
const DCZ_YAML_URL = 'https://raw.githubusercontent.com/denris87/vilnohirsk-jobs-api/main/dcz_jobs.yaml';
// Локальний fallback на випадок недоступності GitHub
const DCZ_LOCAL_PATH = path.join(__dirname, 'dcz_jobs.yaml');
// Кеш YAML у пам'яті (щоб не довбати github raw на кожен запит)
const YAML_CACHE_TTL_MS = 30 * 1000; // 30 секунд

let currentJobs = []; // тільки Work.ua (ДЦЗ читається на льоту)
let dczCache = { time: 0, items: [] };

// ==========================================
// 1. ШВИДКІ МАРШРУТИ
// ==========================================
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 20px;">
      <h1 style="color: #00b8ff;">Smart Vilnohirsk Jobs Parser 🚀</h1>
      <p>Статус сервера: <b style="color: green;">Активний і працює!</b></p>
      <p>Work.ua в базі: <b>${currentJobs.length}</b></p>
      <p>ДЦЗ у кеші: <b>${dczCache.items.length}</b> (вік: ${Math.round((Date.now() - dczCache.time)/1000)}с)</p>
      <p>Джерело ДЦЗ: <a href="${DCZ_YAML_URL}" target="_blank">${DCZ_YAML_URL}</a></p>
      <a href="/api/jobs">Подивитися дані (JSON)</a>
    </div>
  `);
});

app.get('/api/jobs', async (req, res) => {
  const dcz = await loadDczJobs();
  const other = currentJobs.filter(j => j.source !== 'ДЦЗ');
  res.json([...dcz, ...other]);
});

// Ручний дроп кешу ДЦЗ — якщо хочеш бачити зміни одразу, відкрий цей URL
app.get('/api/refresh-dcz', async (req, res) => {
  dczCache = { time: 0, items: [] };
  const dcz = await loadDczJobs();
  res.json({ ok: true, loaded: dcz.length });
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
// 3. ДЦЗ З GITHUB RAW (з невеликим кешем)
// ==========================================
async function fetchDczYamlContent() {
  // Кеш на 30 секунд щоб не довбати raw.github
  if (dczCache.items.length && (Date.now() - dczCache.time) < YAML_CACHE_TTL_MS) {
    return dczCache.items;
  }

  let text = null;

  // 1. Спершу пробуємо GitHub raw (буде свіже одразу після пушу)
  try {
    const sep = DCZ_YAML_URL.includes('?') ? '&' : '?';
    const r = await axios.get(`${DCZ_YAML_URL}${sep}_t=${Date.now()}`, { timeout: 8000 });
    text = r.data;
  } catch (e) {
    console.warn('⚠️ Не вдалося завантажити YAML з GitHub:', e.message);
  }

  // 2. Якщо GitHub недоступний — пробуємо локальний файл
  if (!text && fs.existsSync(DCZ_LOCAL_PATH)) {
    console.log('ℹ️ Використовуємо локальний dcz_jobs.yaml');
    text = fs.readFileSync(DCZ_LOCAL_PATH, 'utf8');
  }

  if (!text) {
    console.log('ℹ️ ДЦЗ-вакансій немає (ні GitHub, ні локального файлу)');
    return [];
  }

  try {
    const data = yaml.load(text);
    if (!data || !Array.isArray(data.jobs)) {
      console.log('⚠️ dcz_jobs.yaml: поле "jobs" відсутнє або не масив');
      return [];
    }
    const items = transformDczItems(data.jobs);
    dczCache = { time: Date.now(), items };
    console.log(`📋 ДЦЗ: завантажено ${items.length} вакансій (кеш на ${YAML_CACHE_TTL_MS/1000}с)`);
    return items;
  } catch (e) {
    console.error('❌ Помилка парсингу YAML:', e.message);
    return [];
  }
}

function transformDczItems(jobs) {
  return jobs.map((item, idx) => {
    const phone = String(item.phone || '').trim();
    const employment = item.employment_type
      ? item.employment_type.charAt(0).toUpperCase() + item.employment_type.slice(1)
      : 'Повна';

    let desc = String(item.description || '').trim();

    if (item.location) {
      const loc = item.location;
      const parts = [loc.settlement, loc.district, loc.region].filter(Boolean);
      if (parts.length) desc += `\n\n📍 ${parts.join(', ')}`;
      if (loc.community) desc += ` (${loc.community})`;
    }

    if (item.requirements) {
      const r = item.requirements;
      const reqs = [];
      if (r.education) reqs.push(`Освіта: ${r.education}`);
      if (r.experience) reqs.push(`Досвід: ${r.experience}`);
      if (r.professional_competencies) reqs.push(`Вимоги: ${r.professional_competencies}`);
      if (reqs.length) desc += `\n\n📚 ${reqs.join('\n')}`;
    }

    const conditions = [];
    if (item.work_schedule) conditions.push(`Графік: ${item.work_schedule}`);
    if (item.work_nature) conditions.push(`Характер: ${item.work_nature}`);
    if (item.working_conditions) conditions.push(`Умови: ${item.working_conditions}`);
    if (conditions.length) desc += `\n\n⚙️ ${conditions.join('\n')}`;

    if (item.social_benefits) desc += `\n\n🎁 Соцпакет: ${item.social_benefits}`;

    const badges = [];
    if (item.verified) badges.push('✅ Перевірено ДЦЗ');
    if (item.accessible_for_disabled) badges.push("♿ Безбар'єрна вакансія");
    if (badges.length) desc += `\n\n${badges.join('  •  ')}`;

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
      employment: employment,
      vacancyNumber: item.vacancy_number || `dcz-${idx}`
    };
  });
}

async function loadDczJobs() {
  return await fetchDczYamlContent();
}

// ==========================================
// 4. ГОЛОВНИЙ ПРОЦЕС (тільки Work.ua)
// ==========================================
async function fetchAllJobs() {
  console.log("Починаємо пошук вакансій (Work.ua)...");
  const workJobs = await parseWorkUa();

  const unique = [];
  const seen = new Set();
  workJobs.forEach(job => {
    const key = `${job.title}|${job.company}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(job);
    }
  });

  currentJobs = unique;
  console.log(`✅ Work.ua: ${currentJobs.length} унікальних вакансій (ДЦЗ читається на льоту з GitHub)`);
}

// ==========================================
// 5. ЗАПУСК
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер Railway запущено на порту ${PORT}`);
  setTimeout(() => fetchAllJobs().catch(console.error), 2000);
  setInterval(() => fetchAllJobs().catch(console.error), 3 * 60 * 60 * 1000);
});

process.on('uncaughtException', err => console.error('Помилка:', err.message));
process.on('unhandledRejection', err => console.error('Помилка:', err));
