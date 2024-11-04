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

    const getKursIdSql = `
      SELECT kurs_id FROM formy_sprawdzania WHERE id = ?
    `;

    db.query(getKursIdSql, [forma_sprawdzania_id], (err, kursResult) => {
      if (err) {
        console.error('Błąd pobierania kurs_id:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      const kurs_id = kursResult[0].kurs_id;

      updateCanceledGrade(uczen_id, kurs_id);

      res.status(201).json({ message: 'Ocena dodana' });
    });
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

    const getGradeInfoSql = `
      SELECT uczen_id, forma_sprawdzania_id FROM oceny WHERE id = ?
    `;

    db.query(getGradeInfoSql, [id], (err, gradeResult) => {
      if (err) {
        console.error('Błąd pobierania informacji o ocenie:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      const uczen_id = gradeResult[0].uczen_id;
      const forma_sprawdzania_id = gradeResult[0].forma_sprawdzania_id;

      const getKursIdSql = `
        SELECT kurs_id FROM formy_sprawdzania WHERE id = ?
      `;

      db.query(getKursIdSql, [forma_sprawdzania_id], (err, kursResult) => {
        if (err) {
          console.error('Błąd pobierania kurs_id:', err);
          return res.status(500).json({ message: 'Błąd serwera' });
        }

        const kurs_id = kursResult[0].kurs_id;

        updateCanceledGrade(uczen_id, kurs_id);

        res.json({ message: 'Ocena zaktualizowana' });
      });
    });
  });
};

function updateCanceledGrade(uczen_id, kurs_id) {

  const attendanceSql = `
    SELECT COUNT(*) as total_classes, SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as attended_classes
    FROM obecnosci
    WHERE kurs_id = ? AND uczen_id = ?
  `;

  db.query(attendanceSql, [kurs_id, uczen_id], (err, attendanceResult) => {
    if (err) {
      console.error('Błąd sprawdzania frekwencji:', err);
      return;
    }

    const total_classes = attendanceResult[0].total_classes;
    const attended_classes = attendanceResult[0].attended_classes;

    if (attended_classes == total_classes && total_classes > 0) {

      const gradesSql = `
        SELECT o.id, o.wartosc
        FROM oceny o
        JOIN formy_sprawdzania fs ON o.forma_sprawdzania_id = fs.id
        WHERE o.uczen_id = ? AND fs.kurs_id = ?
        ORDER BY o.wartosc ASC, fs.waga ASC
        LIMIT 1
      `;

      db.query(gradesSql, [uczen_id, kurs_id], (err, gradesResult) => {
        if (err) {
          console.error('Błąd pobierania ocen:', err);
          return;
        }

        const unCancelSql = `
          UPDATE oceny
          SET anulowana = 0
          WHERE uczen_id = ? AND anulowana = 1 AND forma_sprawdzania_id IN (
            SELECT id FROM formy_sprawdzania WHERE kurs_id = ?
          )
        `;

        db.query(unCancelSql, [uczen_id, kurs_id], (err, unCancelResult) => {
          if (err) {
            console.error('Błąd przywracania anulowanych ocen:', err);
            return;
          }

          if (gradesResult.length > 0) {
            const lowestGradeId = gradesResult[0].id;

            const cancelSql = `
              UPDATE oceny
              SET anulowana = 1
              WHERE id = ?
            `;

            db.query(cancelSql, [lowestGradeId], (err, cancelResult) => {
              if (err) {
                console.error('Błąd anulowania najniższej oceny:', err);
                return;
              }

              console.log(`Anulowano najniższą ocenę dla ucznia ${uczen_id} w kursie ${kurs_id}`);
            });
          } else {
            console.log(`Brak ocen do anulowania dla ucznia ${uczen_id} w kursie ${kurs_id}`);
          }
        });
      });
    } else {
      const unCancelSql = `
        UPDATE oceny
        SET anulowana = 0
        WHERE uczen_id = ? AND anulowana = 1 AND forma_sprawdzania_id IN (
          SELECT id FROM formy_sprawdzania WHERE kurs_id = ?
        )
      `;

      db.query(unCancelSql, [uczen_id, kurs_id], (err, unCancelResult) => {
        if (err) {
          console.error('Błąd przywracania anulowanych ocen:', err);
          return;
        }

        console.log(`Przywrócono anulowane oceny dla ucznia ${uczen_id} w kursie ${kurs_id}`);
      });
    }
  });
}

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
