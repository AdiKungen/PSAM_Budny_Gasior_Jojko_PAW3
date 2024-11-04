const db = require('../config/db');

exports.getAttendanceDatesByCourse = (req, res) => {
  const { kurs_id } = req.params;

  const sql = `
    SELECT DISTINCT data
    FROM obecnosci
    WHERE kurs_id = ?
    ORDER BY data
  `;

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania dat zajęć:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

exports.getAttendanceByCourse = (req, res) => {
  const { kurs_id } = req.params;

  const sql = `
    SELECT o.uczen_id, o.data, o.status, u.imie, u.nazwisko
    FROM obecnosci o
    JOIN uczniowie u ON o.uczen_id = u.id
    WHERE o.kurs_id = ?
  `;

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania obecności uczniów:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

exports.updateAttendanceStatus = (req, res) => {
  const { kurs_id, uczen_id, data, status } = req.body;

  const sql = `
    UPDATE obecnosci
    SET status = ?
    WHERE kurs_id = ? AND uczen_id = ? AND data = ?
  `;

  db.query(sql, [status, kurs_id, uczen_id, data], (err, result) => {
    if (err) {
      console.error('Błąd aktualizacji statusu obecności:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    updateCanceledGrade(uczen_id, kurs_id);

    res.json({ message: 'Status obecności zaktualizowany' });
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

exports.addAttendanceForToday = (req, res) => {
  const { kurs_id } = req.body;
  const today = new Date().toISOString().substring(0, 10);

  const getStudentsSql = `
    SELECT DISTINCT u.id AS uczen_id
    FROM uczniowie u
    JOIN (
      SELECT DISTINCT uczen_id FROM obecnosci WHERE kurs_id = ?
      UNION
      SELECT DISTINCT o.uczen_id
      FROM oceny o
      JOIN formy_sprawdzania fs ON o.forma_sprawdzania_id = fs.id
      WHERE fs.kurs_id = ?
    ) AS uczeni_kursu ON u.id = uczeni_kursu.uczen_id
  `;

  db.query(getStudentsSql, [kurs_id, kurs_id], (err, studentResults) => {
    if (err) {
      console.error('Błąd pobierania uczniów dla kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (studentResults.length === 0) {
      return res.status(404).json({ message: 'Brak uczniów zapisanych na kurs' });
    }

    const attendanceEntries = studentResults.map((student) => [
      kurs_id,
      student.uczen_id,
      today,
      null, 
    ]);

    const insertAttendanceSql = `
      INSERT INTO obecnosci (kurs_id, uczen_id, data, status)
      VALUES ?
      ON DUPLICATE KEY UPDATE status = status
    `;

    db.query(insertAttendanceSql, [attendanceEntries], (err, result) => {
      if (err) {
        console.error('Błąd dodawania obecności na dzisiejszy dzień:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }

      studentResults.forEach((student) => {
        updateCanceledGrade(student.uczen_id, kurs_id);
      });

      res.json({ message: 'Obecność na dzisiejszy dzień dodana' });
    });
  });
};