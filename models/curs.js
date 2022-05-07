const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Examen = require('./examen');
const Lectie = require('./lectie');
const CursuriStudent = require('./cursuri_student');

const Curs = sequelize.define(
  'Curs',
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
  { tableName: 'Cursuri' }
);
Curs.hasMany(Examen, { foreignKey: 'id_curs', onDelete: 'CASCADE' });
Curs.hasMany(Lectie, { foreignKey: 'id_curs', onDelete: 'CASCADE' });
Curs.hasMany(CursuriStudent, { foreignKey: 'id_curs', onDelete: 'CASCADE' });

module.exports = Curs;
