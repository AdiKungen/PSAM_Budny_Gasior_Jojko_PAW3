// routes/formaSprawdzania.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { FormaSprawdzania } = require('../models');

router.post('/', auth, async (req, res) => {
  const { kurs_id, typ, waga } = req.body;
  try {
    const forma = await FormaSprawdzania.create({ kurs_id, typ, waga });
    res.status(201).json(forma);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas dodawania formy sprawdzania wiedzy' });
  }
});

module.exports = router;