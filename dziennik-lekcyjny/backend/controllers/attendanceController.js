const db = require('../config/db');

exports.markAttendance = (req, res) => {
  const { kurs_id, obecnosci } = req.body; // obecnosci to tablica obiektów { uczen_id, status, data }

  const values = obecnosci.map(({ uczen_id, status, data }) => [kurs_id, uczen_id, data, status]);

  const sql = 'INSERT INTO obecnosci (kurs_id, uczen_id, data, status) VALUES ? ON DUPLICATE KEY UPDATE status = VALUES(status)';

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Błąd zapisywania obecności:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json({ message: 'Obecność zapisana' });
  });
};

exports.getAttendanceHistory = (req, res) => {
  const { kurs_id, uczen_id } = req.params;

  const sql = 'SELECT * FROM obecnosci WHERE kurs_id = ? AND uczen_id = ?';

  db.query(sql, [kurs_id, uczen_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania historii obecności:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};