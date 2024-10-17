// models/Nauczyciel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nauczyciel = sequelize.define('nauczyciele', {
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
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  haslo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'nauczyciele',
  timestamps: false
});

module.exports = Nauczyciel;