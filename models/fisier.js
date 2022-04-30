const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Fisier = sequelize.define(
  'Fisiere',
  {
    continut: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    titlu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'Fisiere' }
);

module.exports = Fisier;
