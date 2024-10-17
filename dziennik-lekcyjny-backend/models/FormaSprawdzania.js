// models/FormaSprawdzania.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Kurs = require('./kurs');

const FormaSprawdzania = sequelize.define('formy_sprawdzania', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kurs_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Kurs,
      key: 'id'
    }
  },
  typ: {
    type: DataTypes.ENUM('kartkowka', 'sprawdzian', 'odpowiedz_ustna', 'inna'),
    allowNull: false
  },
  waga: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }
}, {
  tableName: 'formy_sprawdzania',
  timestamps: false
});

module.exports = FormaSprawdzania;