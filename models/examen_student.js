const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const ExamenStudent = sequelize.define(
  'ExamenStudent',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    punctaj: {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      validate: {
        min: -1,
      },
    },
    raspunsuri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { tableName: 'examen_student' }
);

module.exports = ExamenStudent;
