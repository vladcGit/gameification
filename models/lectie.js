const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Fisier = require('./fisier');

const Lectie = sequelize.define(
  'Lectie',
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
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriere: {
      type: DataTypes.STRING,
    },
  },
  { tableName: 'Lectii' }
);

Lectie.hasMany(Fisier, { foreignKey: 'id_lectie', onDelete: 'CASCADE' });

module.exports = Lectie;
