// models/Uczen.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Uczen = sequelize.define('uczniowie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  imie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nazwisko: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'uczniowie',
  timestamps: false
});

module.exports = Uczen;