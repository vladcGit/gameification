const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Curs = require('./curs');

const Materie = sequelize.define(
  'Materie',
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
  { tableName: 'Materii' }
);

Materie.hasMany(Curs, { foreignKey: 'id_materie', onDelete: 'CASCADE' });

module.exports = Materie;
