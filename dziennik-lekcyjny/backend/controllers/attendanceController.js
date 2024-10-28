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
  const { kurs_id, uczen_id, data } = req.body;
  const { status } = req.body;

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
    res.json({ message: 'Status obecności zaktualizowany' });
  });
};

exports.addAttendanceForToday = (req, res) => {
  const { kurs_id } = req.body;
  const today = new Date().toISOString().substring(0, 10);

  const getStudentsSql = `
    SELECT DISTINCT uczen_id
    FROM obecnosci
    WHERE kurs_id = ?
  `;

  db.query(getStudentsSql, [kurs_id], (err, studentResults) => {
    if (err) {
      console.error('Błąd pobierania uczniów dla kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const insertAttendanceSql = `
      INSERT INTO obecnosci (kurs_id, uczen_id, data, status)
      VALUES (?, ?, ?, NULL)
      ON DUPLICATE KEY UPDATE status = status
    `;

    const attendanceEntries = studentResults.map((student) => {
      return [kurs_id, student.uczen_id, today];
    });

    const values = attendanceEntries.map((entry) => `(${db.escape(entry[0])}, ${db.escape(entry[1])}, ${db.escape(entry[2])}, NULL)`).join(',');

    const finalInsertSql = `
      INSERT INTO obecnosci (kurs_id, uczen_id, data, status)
      VALUES ${values}
      ON DUPLICATE KEY UPDATE status = status
    `;

    db.query(finalInsertSql, (err, result) => {
      if (err) {
        console.error('Błąd dodawania obecności na dzisiejszy dzień:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }
      res.json({ message: 'Obecność na dzisiejszy dzień dodana' });
    });
  });
};