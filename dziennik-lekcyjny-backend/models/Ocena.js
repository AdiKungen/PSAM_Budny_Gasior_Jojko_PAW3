// models/Ocena.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Uczen = require('./Uczen');
const FormaSprawdzania = require('./FormaSprawdzania');

const Ocena = sequelize.define('oceny', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uczen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Uczen,
      key: 'id'
    }
  },
  forma_sprawdzania_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FormaSprawdzania,
      key: 'id'
    }
  },
  wartosc: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  anulowana: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'oceny',
  timestamps: false
});

module.exports = Ocena;