// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Teacher } = require('../models');

// Rejestracja
router.post('/register', async (req, res) => {
  const { imie, nazwisko, login, haslo } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(haslo, 10);
    const teacher = await Teacher.create({ imie, nazwisko, login, haslo: hashedPassword });
    res.status(201).json({ message: 'Konto zostało utworzone' });
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas rejestracji' });
  }
});

// Logowanie
router.post('/login', async (req, res) => {
  const { login, haslo } = req.body;
  try {
    const teacher = await Teacher.findOne({ where: { login } });
    if (!teacher) return res.status(400).json({ error: 'Nieprawidłowy login lub hasło' });

    const isMatch = await bcrypt.compare(haslo, teacher.haslo);
    if (!isMatch) return res.status(400).json({ error: 'Nieprawidłowy login lub hasło' });

    const token = jwt.sign({ id: teacher.id }, 'tajny_klucz');
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas logowania' });
  }
});

module.exports = router;