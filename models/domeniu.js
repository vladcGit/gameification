const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Materie = require('./materie');

const Domeniu = sequelize.define(
  'Domeniu',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriere: {
      type: DataTypes.STRING,
    },
  },
  { tableName: 'Domenii' }
);

Domeniu.hasMany(Materie, { foreignKey: 'id_domeniu', onDelete: 'CASCADE' });

module.exports = Domeniu;
