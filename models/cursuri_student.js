const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const CursuriStudent = sequelize.define(
  'CursuriStudent',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { tableName: 'curs_student' }
);

module.exports = CursuriStudent;
