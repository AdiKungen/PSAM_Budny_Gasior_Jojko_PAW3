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

exports.getStudentsByCourse = (req, res) => {
  const { kurs_id } = req.params;

  const sql = `
    SELECT DISTINCT u.*
    FROM uczniowie u
    JOIN obecnosci ob ON u.id = ob.uczen_id
    WHERE ob.kurs_id = ?
  `;

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania uczniów dla kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

exports.getStudentsNotInCourse = (req, res) => {
  const { kurs_id } = req.params;

  const sql = `
    SELECT * FROM uczniowie u
    WHERE u.id NOT IN (
      SELECT DISTINCT uczen_id FROM obecnosci WHERE kurs_id = ?
    )
  `;

  db.query(sql, [kurs_id], (err, results) => {
    if (err) {
      console.error('Błąd pobierania uczniów nie zapisanych na kurs:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    res.json(results);
  });
};

exports.addStudentToCourse = (req, res) => {
  const { kurs_id, uczen_id } = req.body;

  const getCourseDateSql = 'SELECT data_rozpoczecia FROM kursy WHERE id = ?';

  db.query(getCourseDateSql, [kurs_id], (err, courseResults) => {
    if (err) {
      console.error('Błąd pobierania daty rozpoczęcia kursu:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
    if (courseResults.length === 0) {
      return res.status(404).json({ message: 'Nie znaleziono kursu o podanym ID' });
    }

    const data_rozpoczecia = courseResults[0].data_rozpoczecia;

    const sql = 'INSERT INTO obecnosci (kurs_id, uczen_id, data, status) VALUES (?, ?, ?, NULL)';

    db.query(sql, [kurs_id, uczen_id, data_rozpoczecia], (err, result) => {
      if (err) {
        console.error('Błąd dodawania ucznia do kursu:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }
      res.status(201).json({ message: 'Uczeń dodany do kursu' });
    });
  });
};
