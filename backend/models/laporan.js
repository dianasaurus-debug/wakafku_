'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laporan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Laporan.belongsTo(models.ProgramWakaf, {
        foreignKey: 'ProgramId',
        targetKey: 'id',
        as: 'program_wakaf',
      });
    }
  };
  Laporan.init({
    deskripsi: DataTypes.TEXT,
    ProgramId: DataTypes.INTEGER,
    gambar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'laporan',
    modelName: 'Laporan',
  });
  return Laporan;
};
