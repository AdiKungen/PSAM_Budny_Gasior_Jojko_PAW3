// routes/kurs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Kurs } = require('../models');

// Tworzenie kursu
router.post('/', auth, async (req, res) => {
  const { nazwa, data_rozpoczecia } = req.body;
  try {
    const kurs = await Kurs.create({
      nazwa,
      data_rozpoczecia,
      nauczyciel_id: req.user.id,
    });
    res.status(201).json(kurs);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas tworzenia kursu' });
  }
});

// Pobieranie kursów nauczyciela
router.get('/', auth, async (req, res) => {
  try {
    const kursy = await Kurs.findAll({ where: { nauczyciel_id: req.user.id } });
    res.json(kursy);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas pobierania kursów' });
  }
});

module.exports = router;