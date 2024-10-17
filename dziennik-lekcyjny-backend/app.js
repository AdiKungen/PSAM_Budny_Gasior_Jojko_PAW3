// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import bazy danych i modeli
const sequelize = require('./config/database');
const {
  Nauczyciel,
  Kurs,
  Uczen,
  Obecnosc,
  Ocena,
  FormaSprawdzania,
  KursyUczniowie,
} = require('./models');

// Inicjalizacja aplikacji Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test połączenia z bazą danych
sequelize
  .authenticate()
  .then(() => {
    console.log('Połączono z bazą danych MySQL.');
  })
  .catch((err) => {
    console.error('Błąd połączenia z bazą danych:', err);
  });

// Synchronizacja modeli z bazą danych (opcjonalne)
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Synchronizacja modeli zakończona.');
//   })
//   .catch((err) => {
//     console.error('Błąd synchronizacji modeli:', err);
//   });

// Importuj trasy
const authRoutes = require('./routes/auth');
const kursRoutes = require('./routes/kurs');
const uczenRoutes = require('./routes/uczen');
const obecnoscRoutes = require('./routes/obecnosc');
const ocenaRoutes = require('./routes/ocena');
const formaSprawdzaniaRoutes = require('./routes/formaSprawdzania');

// Użycie tras
app.use('/api/auth', authRoutes);
app.use('/api/kursy', kursRoutes);
app.use('/api/uczniowie', uczenRoutes);
app.use('/api/obecnosci', obecnoscRoutes);
app.use('/api/oceny', ocenaRoutes);
app.use('/api/formy-sprawdzania', formaSprawdzaniaRoutes);

// Obsługa błędów 404
app.use((req, res, next) => {
  const error = new Error('Nie znaleziono');
  error.status = 404;
  next(error);
});

// Globalna obsługa błędów
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}.`);
});

module.exports = app;