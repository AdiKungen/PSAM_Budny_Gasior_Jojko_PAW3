// routes/uczen.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Uczen, Kurs } = require('../models');

// Dodaj nowego ucznia
router.post('/', auth, async (req, res) => {
  const { imie, nazwisko } = req.body;
  try {
    const uczen = await Uczen.create({ imie, nazwisko });
    res.status(201).json(uczen);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas dodawania ucznia' });
  }
});

// Pobierz listę wszystkich uczniów
router.get('/', auth, async (req, res) => {
  try {
    const uczniowie = await Uczen.findAll();
    res.json(uczniowie);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas pobierania uczniów' });
  }
});

// Pobierz dane konkretnego ucznia
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const uczen = await Uczen.findByPk(id);
    if (!uczen) {
      return res.status(404).json({ error: 'Uczeń nie znaleziony' });
    }
    res.json(uczen);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas pobierania ucznia' });
  }
});

// Edytuj dane ucznia
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { imie, nazwisko } = req.body;
  try {
    const uczen = await Uczen.findByPk(id);
    if (!uczen) {
      return res.status(404).json({ error: 'Uczeń nie znaleziony' });
    }
    await uczen.update({ imie, nazwisko });
    res.json(uczen);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas aktualizacji ucznia' });
  }
});

// Usuń ucznia
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const uczen = await Uczen.findByPk(id);
    if (!uczen) {
      return res.status(404).json({ error: 'Uczeń nie znaleziony' });
    }
    await uczen.destroy();
    res.json({ message: 'Uczeń został usunięty' });
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas usuwania ucznia' });
  }
});

// Przydziel ucznia do kursu
router.post('/assign', auth, async (req, res) => {
  const { kursId, uczenId } = req.body;
  try {
    // Sprawdź, czy kurs należy do zalogowanego nauczyciela
    const kurs = await Kurs.findOne({
      where: { id: kursId, nauczyciel_id: req.user.id },
    });
    if (!kurs) {
      return res.status(404).json({ error: 'Kurs nie znaleziony' });
    }
    // Sprawdź, czy uczeń istnieje
    const uczen = await Uczen.findByPk(uczenId);
    if (!uczen) {
      return res.status(404).json({ error: 'Uczeń nie znaleziony' });
    }
    // Dodaj ucznia do kursu
    await kurs.addUczen(uczen);
    res.json({ message: 'Uczeń został przypisany do kursu' });
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas przypisywania ucznia do kursu' });
  }
});

// Usuń ucznia z kursu
router.post('/remove', auth, async (req, res) => {
  const { kursId, uczenId } = req.body;
  try {
    // Sprawdź, czy kurs należy do zalogowanego nauczyciela
    const kurs = await Kurs.findOne({
      where: { id: kursId, nauczyciel_id: req.user.id },
    });
    if (!kurs) {
      return res.status(404).json({ error: 'Kurs nie znaleziony' });
    }
    // Sprawdź, czy uczeń istnieje
    const uczen = await Uczen.findByPk(uczenId);
    if (!uczen) {
      return res.status(404).json({ error: 'Uczeń nie znaleziony' });
    }
    // Usuń ucznia z kursu
    await kurs.removeUczen(uczen);
    res.json({ message: 'Uczeń został usunięty z kursu' });
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas usuwania ucznia z kursu' });
  }
});

// Pobierz uczniów przypisanych do kursu
router.get('/kurs/:kursId', auth, async (req, res) => {
  const { kursId } = req.params;
  try {
    // Sprawdź, czy kurs należy do zalogowanego nauczyciela
    const kurs = await Kurs.findOne({
      where: { id: kursId, nauczyciel_id: req.user.id },
      include: [{ model: Uczen, through: { attributes: [] } }],
    });
    if (!kurs) {
      return res.status(404).json({ error: 'Kurs nie znaleziony' });
    }
    res.json(kurs.Uczniowie);
  } catch (error) {
    res.status(400).json({ error: 'Błąd podczas pobierania uczniów kursu' });
  }
});

module.exports = router;
