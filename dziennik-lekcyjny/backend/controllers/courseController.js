const db = require('../config/db');

exports.createCourse = (req, res) => {
  const { nazwa, data_rozpoczecia } = req.body;
  const nauczyciel_id = req.user.id;

  const sql = 'INSERT INTO kursy (nazwa, data_rozpoczecia, nauczyciel_id) VALUES (?, ?, ?)';

  db.query(sql, [nazwa, data_rozpoczecia, nauczyciel_id], (err, result) => {
    if (err) {
      console.error('Błąd tworzenia kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.status(201).json({ message: 'Kurs utworzony pomyślnie' });
  });
};

exports.getCourses = (req, res) => {
  const nauczyciel_id = req.user.id;

  const sql = 'SELECT * FROM kursy WHERE nauczyciel_id = ?';

  db.query(sql, [nauczyciel_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania kursów:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

exports.getCourseById = (req, res) => {
  const kurs_id = req.params.id;

  const sql = 'SELECT * FROM kursy WHERE id = ?';

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

