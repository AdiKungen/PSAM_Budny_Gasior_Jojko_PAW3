const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { imie, nazwisko, login, haslo } = req.body;

  const hashedPassword = bcrypt.hashSync(haslo, 10);

  const sql = 'INSERT INTO nauczyciele (imie, nazwisko, login, haslo) VALUES (?, ?, ?, ?)';

  db.query(sql, [imie, nazwisko, login, hashedPassword], (err, result) => {
    if (err) {
      console.error('Błąd rejestracji:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Konto utworzone pomyślnie' });
  });
};

exports.login = (req, res) => {
  const { login, haslo } = req.body;

  const sql = 'SELECT * FROM nauczyciele WHERE login = ?';

  db.query(sql, [login], (err, results) => {
    if (err) {
      console.error('Błąd logowania:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
    }

    const nauczyciel = results[0];

    if (!bcrypt.compareSync(haslo, nauczyciel.haslo)) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
    }

    const token = jwt.sign({ id: nauczyciel.id }, 'tajny_klucz', { expiresIn: '1h' });

    res.json({ token });
  });
};