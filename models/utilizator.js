const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const ExamenStudent = require('./examen_student');
const Curs = require('./curs');
const Experienta = require('./experienta');
const CursuriStudent = require('./cursuri_student');

const Utilizator = sequelize.define(
  'Utilizator',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    parola: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eProfesor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: 'Utilizatori' }
);

Utilizator.hasMany(ExamenStudent, {
  foreignKey: 'id_student',
  onDelete: 'CASCADE',
});
Utilizator.hasMany(Curs, {
  foreignKey: 'id_creator',
  onDelete: 'CASCADE',
});
Utilizator.hasMany(Experienta, {
  foreignKey: 'id_student',
  onDelete: 'CASCADE',
});
Utilizator.hasMany(CursuriStudent, {
  foreignKey: 'id_student',
  onDelete: 'CASCADE',
});

module.exports = Utilizator;
