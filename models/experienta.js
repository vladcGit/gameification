const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const Experienta = sequelize.define(
  'Experienta',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    xp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
      defaultValue: 0,
    },
    rank: {
      type: DataTypes.ENUM('Incepator', 'Entuziast', 'Maestru'),
      defaultValue: 'Incepator',
    },
  },
  { tableName: 'Experienta' }
);

module.exports = Experienta;
