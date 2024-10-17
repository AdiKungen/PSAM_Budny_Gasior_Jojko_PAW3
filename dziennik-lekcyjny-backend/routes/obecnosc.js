// routes/obecnosc.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Obecnosc } = require('../models');

router.post('/', auth, async (req, res) => {
  const { kurs_id, uczen_id, data, status } = req.body;
  try {
    const obecnosc = await Obecnosc.create({ kurs_id, uczen_id, data, status });
    res.status(201).json(obecnosc);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas zapisywania obecności' });
  }
});

module.exports = router;