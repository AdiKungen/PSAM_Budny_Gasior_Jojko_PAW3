const db = require('../config/db');

exports.addStudent = (req, res) => {
  const { imie, nazwisko } = req.body;

  const sql = 'INSERT INTO uczniowie (imie, nazwisko) VALUES (?, ?)';

  db.query(sql, [imie, nazwisko], (err, result) => {
    if (err) {
      console.error('Błąd dodawania ucznia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Uczeń dodany pomyślnie' });
  });
};

exports.updateStudent = (req, res) => {
  const { imie, nazwisko } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE uczniowie SET imie = ?, nazwisko = ? WHERE id = ?';

  db.query(sql, [imie, nazwisko, id], (err, result) => {
    if (err) {
      console.error('Błąd edycji ucznia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json({ message: 'Dane ucznia zaktualizowane' });
  });
};

exports.deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM uczniowie WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Błąd usuwania ucznia:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json({ message: 'Uczeń usunięty' });
  });
};

exports.getStudents = (req, res) => {
  const sql = 'SELECT * FROM uczniowie';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Błąd pobierania uczniów:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};