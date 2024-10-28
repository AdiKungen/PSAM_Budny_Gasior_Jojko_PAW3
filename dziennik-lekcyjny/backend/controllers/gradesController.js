const db = require('../config/db');

exports.addForm = (req, res) => {
  const { kurs_id, typ, waga, opis } = req.body;

  const sql = 'INSERT INTO formy_sprawdzania (kurs_id, typ, waga, opis) VALUES (?, ?, ?, ?)';

  db.query(sql, [kurs_id, typ, waga, opis], (err, result) => {
    if (err) {
      console.error('Błąd dodawania formy sprawdzania:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Forma sprawdzania dodana' });
  });
};

exports.addGrade = (req, res) => {
  const { uczen_id, forma_sprawdzania_id, wartosc, data } = req.body;

  const sql = 'INSERT INTO oceny (uczen_id, forma_sprawdzania_id, wartosc, data) VALUES (?, ?, ?, ?)';

  db.query(sql, [uczen_id, forma_sprawdzania_id, wartosc, data], (err, result) => {
    if (err) {
      console.error('Błąd dodawania oceny:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Ocena dodana' });
  });
};

exports.updateGrade = (req, res) => {
  const { id } = req.params;
  const { wartosc } = req.body;

  const sql = 'UPDATE oceny SET wartosc = ? WHERE id = ?';

  db.query(sql, [wartosc, id], (err, result) => {
    if (err) {
      console.error('Błąd aktualizacji oceny:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json({ message: 'Ocena zaktualizowana' });
  });
};

exports.getAverage = (req, res) => {
  const { kurs_id, uczen_id } = req.params;

  const obecnosciSql = 'SELECT COUNT(*) AS total, SUM(status) AS obecny FROM obecnosci WHERE kurs_id = ? AND uczen_id = ?';
  db.query(obecnosciSql, [kurs_id, uczen_id], (err, obecnosciResult) => {
    if (err) {
      console.error('Błąd pobierania obecności:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const { total, obecny } = obecnosciResult[0];
    const frekwencja = (obecny / total) * 100;

    const ocenySql = `
      SELECT o.*, fs.typ, fs.waga
      FROM oceny o
      JOIN formy_sprawdzania fs ON o.forma_sprawdzania_id = fs.id
      WHERE fs.kurs_id = ? AND o.uczen_id = ? AND o.anulowana = 0
    `;

    db.query(ocenySql, [kurs_id, uczen_id], (err, ocenyResult) => {
      if (err) {
        console.error('Błąd pobierania ocen:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      if (frekwencja === 100) {
        const kartkowki = ocenyResult.filter(ocena => ocena.typ === 'kartkowka');
        if (kartkowki.length > 0) {
          const najnizszaKartkowka = kartkowki.reduce((prev, current) => (prev.wartosc < current.wartosc) ? prev : current);
          const updateSql = 'UPDATE oceny SET anulowana = 1 WHERE id = ?';
          db.query(updateSql, [najnizszaKartkowka.id], (err, updateResult) => {
            if (err) {
              console.error('Błąd anulowania oceny:', err);
              return res.status(500).json({ message: 'Błąd serwera' });
            }
            ocenyResult = ocenyResult.filter(ocena => ocena.id !== najnizszaKartkowka.id);
            obliczSrednia(ocenyResult, res);
          });
        } else {
          obliczSrednia(ocenyResult, res);
        }
      } else {
        obliczSrednia(ocenyResult, res);
      }
    });
  });
};

function obliczSrednia(oceny, res) {
  let sumaWazona = 0;
  let sumaWag = 0;

  oceny.forEach(ocena => {
    sumaWazona += ocena.wartosc * ocena.waga;
    sumaWag += ocena.waga;
  });

  const srednia = sumaWazona / sumaWag;

  res.json({ srednia });
}

exports.getFormsByCourse = (req, res) => {
  const { kurs_id } = req.params;

  const sql = 'SELECT * FROM formy_sprawdzania WHERE kurs_id = ?';

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania form sprawdzania:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

exports.getGradesByCourse = (req, res) => {
  const { kurs_id } = req.params;

  const sql = `SELECT o.* FROM oceny o JOIN formy_sprawdzania f ON f.id = o.forma_sprawdzania_id WHERE f.kurs_id = ?`;

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania ocen dla kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};
