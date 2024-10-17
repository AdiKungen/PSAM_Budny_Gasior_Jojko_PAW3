// models/Obecnosc.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Kurs = require('./kurs');
const Uczen = require('./Uczen');

const Obecnosc = sequelize.define('obecnosci', {
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
  uczen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Uczen,
      key: 'id'
    }
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  tableName: 'obecnosci',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['kurs_id', 'uczen_id', 'data']
    }
  ]
});

module.exports = Obecnosc;