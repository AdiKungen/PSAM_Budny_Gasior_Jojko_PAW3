// routes/ocena.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Ocena, Uczen, FormaSprawdzania, Obecnosc, Kurs } = require('../models');
const { Op } = require('sequelize');

// Dodaj nową ocenę
router.post('/', auth, async (req, res) => {
  const { uczenId, formaSprawdzaniaId, wartosc, data } = req.body;
  try {
    // Sprawdź, czy forma sprawdzania istnieje i należy do nauczyciela
    const formaSprawdzania = await FormaSprawdzania.findOne({
      where: { id: formaSprawdzaniaId },
      include: {
        model: Kurs,
        where: { nauczyciel_id: req.user.id },
      },
    });
    if (!formaSprawdzania) {
      return res.status(404).json({ error: 'Forma sprawdzania nie znaleziona lub brak dostępu' });
    }

    // Sprawdź, czy uczeń jest przypisany do kursu
    const kurs = formaSprawdzania.Kurs;
    const uczen = await kurs.getUczniowie({ where: { id: uczenId } });
    if (!uczen.length) {
      return res.status(404).json({ error: 'Uczeń nie jest przypisany do kursu' });
    }

    // Dodaj ocenę
    const ocena = await Ocena.create({
      uczen_id: uczenId,
      forma_sprawdzania_id: formaSprawdzaniaId,
      wartosc,
      data,
      anulowana: false,
    });
    res.status(201).json(ocena);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Błąd podczas dodawania oceny' });
  }
});

// Edytuj ocenę
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { wartosc } = req.body;
  try {
    // Znajdź ocenę i sprawdź, czy nauczyciel ma do niej dostęp
    const ocena = await Ocena.findOne({
      where: { id },
      include: {
        model: FormaSprawdzania,
        include: {
          model: Kurs,
          where: { nauczyciel_id: req.user.id },
        },
      },
    });
    if (!ocena) {
      return res.status(404).json({ error: 'Ocena nie znaleziona lub brak dostępu' });
    }

    // Aktualizuj ocenę
    await ocena.update({ wartosc });
    res.json(ocena);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Błąd podczas aktualizacji oceny' });
  }
});

// Pobierz oceny ucznia na kursie
router.get('/', auth, async (req, res) => {
  const { uczenId, kursId } = req.query;
  try {
    // Sprawdź, czy kurs należy do nauczyciela
    const kurs = await Kurs.findOne({
      where: { id: kursId, nauczyciel_id: req.user.id },
    });
    if (!kurs) {
      return res.status(404).json({ error: 'Kurs nie znaleziony lub brak dostępu' });
    }

    // Sprawdź, czy uczeń jest przypisany do kursu
    const uczen = await kurs.getUczniowie({ where: { id: uczenId } });
    if (!uczen.length) {
      return res.status(404).json({ error: 'Uczeń nie jest przypisany do kursu' });
    }

    // Pobierz oceny
    const oceny = await Ocena.findAll({
      where: { uczen_id: uczenId, anulowana: false },
      include: {
        model: FormaSprawdzania,
        where: { kurs_id: kursId },
      },
    });
    res.json(oceny);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Błąd podczas pobierania ocen' });
  }
});

// Oblicz średnią ważoną dla ucznia na kursie
router.get('/srednia', auth, async (req, res) => {
  const { uczenId, kursId } = req.query;
  try {
    // Sprawdź, czy kurs należy do nauczyciela
    const kurs = await Kurs.findOne({
      where: { id: kursId, nauczyciel_id: req.user.id },
    });
    if (!kurs) {
      return res.status(404).json({ error: 'Kurs nie znaleziony lub brak dostępu' });
    }

    // Sprawdź, czy uczeń jest przypisany do kursu
    const uczniowie = await kurs.getUczniowie({ where: { id: uczenId } });
    if (!uczniowie.length) {
      return res.status(404).json({ error: 'Uczeń nie jest przypisany do kursu' });
    }

    // Sprawdź frekwencję ucznia
    const wszystkieZajecia = await Obecnosc.count({
      where: { kurs_id: kursId },
      group: ['data'],
    });

    const obecnosciUcznia = await Obecnosc.count({
      where: { kurs_id: kursId, uczen_id: uczenId, status: true },
    });

    const liczbaZajec = wszystkieZajecia.length;
    const frekwencja = obecnosciUcznia / liczbaZajec;

    // Pobierz oceny
    let oceny = await Ocena.findAll({
      where: { uczen_id: uczenId, anulowana: false },
      include: {
        model: FormaSprawdzania,
        where: { kurs_id: kursId },
      },
    });

    // Anuluj najniższą ocenę z kartkówki, jeśli frekwencja wynosi 100%
    if (frekwencja === 1) {
      const kartkowki = oceny.filter(
        (o) => o.FormaSprawdzania.typ === 'kartkowka'
      );
      if (kartkowki.length > 0) {
        const najnizszaKartkowka = kartkowki.reduce((prev, curr) =>
          prev.wartosc < curr.wartosc ? prev : curr
        );
        // Oznacz ocenę jako anulowaną
        await najnizszaKartkowka.update({ anulowana: true });
        // Usuń ją z listy ocen do obliczeń
        oceny = oceny.filter((o) => o.id !== najnizszaKartkowka.id);
      }
    }

    // Oblicz średnią ważoną
    let sumaWazona = 0;
    let sumaWag = 0;
    for (const ocena of oceny) {
      const waga = parseFloat(ocena.FormaSprawdzania.waga);
      const wartosc = parseFloat(ocena.wartosc);
      sumaWazona += wartosc * waga;
      sumaWag += waga;
    }

    const srednia = sumaWag > 0 ? (sumaWazona / sumaWag).toFixed(2) : 0;
    res.json({ srednia });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Błąd podczas obliczania średniej' });
  }
});

module.exports = router;
