
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Nauczyciel = require('./Nauczyciel');

const Kurs = sequelize.define('kursy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nauczyciel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Nauczyciel,
      key: 'id'
    }
  },
  nazwa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_rozpoczecia: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'kursy',
  timestamps: false
});

module.exports = Kurs;