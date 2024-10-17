// models/index.js
const Nauczyciel = require('./Nauczyciel');
const Kurs = require('./kurs');
const Uczen = require('./Uczen');
const Obecnosc = require('./Obecnosc');
const Ocena = require('./Ocena');
const FormaSprawdzania = require('./FormaSprawdzania');

// Relacja Nauczyciel - Kurs (1:N)
Nauczyciel.hasMany(Kurs, { foreignKey: 'nauczyciel_id' });
Kurs.belongsTo(Nauczyciel, { foreignKey: 'nauczyciel_id' });

/* Relacja Kurs - Uczen (N:M) przez tabelę kursy_uczniowie
Kurs.belongsToMany(Uczen, { through: 'kursy_uczniowie', foreignKey: 'kurs_id', otherKey: 'uczen_id' });
Uczen.belongsToMany(Kurs, { through: 'kursy_uczniowie', foreignKey: 'uczen_id', otherKey: 'kurs_id' });
*/

// Relacja Kurs - FormaSprawdzania (1:N)
Kurs.hasMany(FormaSprawdzania, { foreignKey: 'kurs_id' });
FormaSprawdzania.belongsTo(Kurs, { foreignKey: 'kurs_id' });

// Relacja Uczen - Ocena (1:N)
Uczen.hasMany(Ocena, { foreignKey: 'uczen_id' });
Ocena.belongsTo(Uczen, { foreignKey: 'uczen_id' });

// Relacja FormaSprawdzania - Ocena (1:N)
FormaSprawdzania.hasMany(Ocena, { foreignKey: 'forma_sprawdzania_id' });
Ocena.belongsTo(FormaSprawdzania, { foreignKey: 'forma_sprawdzania_id' });

// Relacja Kurs - Obecnosc (1:N)
Kurs.hasMany(Obecnosc, { foreignKey: 'kurs_id' });
Obecnosc.belongsTo(Kurs, { foreignKey: 'kurs_id' });

// Relacja Uczen - Obecnosc (1:N)
Uczen.hasMany(Obecnosc, { foreignKey: 'uczen_id' });
Obecnosc.belongsTo(Uczen, { foreignKey: 'uczen_id' });

module.exports = {
  Nauczyciel,
  Kurs,
  Uczen,
  Obecnosc,
  Ocena,
  FormaSprawdzania
};