const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Użytkownik bazy danych
  password: '',        // Hasło do bazy danych
  database: 'test2'    // Nazwa bazy danych
});

connection.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

module.exports = connection;