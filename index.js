const express = require('express');
const cors = require('cors');

const app = express();
// Railway автоматично видасть правильний PORT, або використовуємо 3000 для локальних тестів
const PORT = process.env.PORT || 3000;

// Дозволяємо будь-якому сайту (нашому фронтенду) отримувати дані
app.use(cors());

// База вакансій (Поки що статична. В майбутньому тут можна підключити парсер Work.ua/Robota.ua)
const jobs = [
  {
    title: "Слюсар-ремонтник",
    salary: "18 000 грн",
    company: "Філія «Вільногірський ГМК»",
    description: "Ремонт та обслуговування технологічного обладнання. Повний соцпакет, офіційне працевлаштування.",
    date: "Сьогодні",
    url: "https://www.work.ua/"
  },
  {
    title: "Продавець-консультант",
    salary: "12 000 - 15 000 грн",
    company: "ТОВ «АТБ-маркет»",
    description: "Гнучкий графік, навчання за рахунок компанії. Досвід роботи не обов'язковий.",
    date: "Вчора",
    url: "https://www.work.ua/"
  },
  {
    title: "Вчитель математики",
    salary: "10 000 - 14 000 грн",
    company: "Загальноосвітня школа №3",
    description: "Викладання математики в 5-9 класах. Педагогічна освіта обов'язкова.",
    date: "2 дні тому",
    url: "https://www.work.ua/"
  }
];

// Головна сторінка (просто щоб перевірити, чи працює сервер)
app.get('/', (req, res) => {
  res.send('Vilnohirsk Jobs API is running! 🚀');
});

// Той самий endpoint, до якого звертається наш застосунок
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
