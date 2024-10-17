// services/ocenaService.js
const { Ocena, FormaSprawdzania, Obecnosc, Kurs } = require('../models');

const obliczSredniaWazona = async (uczen_id, kurs_id) => {
  // Sprawdź frekwencję
  const obecnosci = await Obecnosc.findAll({ where: { uczen_id, kurs_id } });
  const wszystkieZajecia = await Kurs.findAll(); // Liczba wszystkich zajęć
  const frekwencja = obecnosci.length / wszystkieZajecia.length; //

  // Pobierz oceny
  let oceny = await Ocena.findAll({
    where: { uczen_id, anulowana: false },
    include: [{ model: FormaSprawdzania, where: { kurs_id } }],
  });

  // Anuluj najniższą kartkówkę, jeśli frekwencja wynosi 100%
  if (frekwencja === 1) {
    const kartkowki = oceny.filter(o => o.FormaSprawdzania.typ === 'kartkowka');
    if (kartkowki.length > 0) {
      const najnizszaKartkowka = kartkowki.reduce((prev, curr) => (prev.wartosc < curr.wartosc ? prev : curr));
      await Ocena.update({ anulowana: true }, { where: { id: najnizszaKartkowka.id } });
      oceny = oceny.filter(o => o.id !== najnizszaKartkowka.id);
    }
  }

  // Oblicz średnią ważoną
  let sumaWazona = 0;
  let sumaWag = 0;
  for (const ocena of oceny) {
    sumaWazona += ocena.wartosc * ocena.FormaSprawdzania.waga;
    sumaWag += ocena.FormaSprawdzania.waga;
  }

  const srednia = sumaWag > 0 ? sumaWazona / sumaWag : 0;
  return srednia;
};

module.exports = { obliczSredniaWazona };