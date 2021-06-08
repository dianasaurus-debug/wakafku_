'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WakafBerjangka extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WakafBerjangka.belongsTo(models.ProgramWakaf, {
        foreignKey: 'program_wakaf_id',
        targetKey: 'id',
        as: 'program_wakaf',
      });
      WakafBerjangka.belongsTo(models.Wakif, {
        foreignKey: 'wakif_id',
        targetKey: 'id',
        as: 'wakif',
      });
    }
  };
  WakafBerjangka.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      program_wakaf_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'program_wakaf',
          key: 'id',
        },
      },
      wakif_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'wakif',
          key: 'id',
        },
      },
      nominal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama_wakif: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metode_pembayaran: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kode_pembayaran: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status_pembayaran: {
        type: DataTypes.ENUM('capture', 'settlement', 'pending', 'deny', 'cancel', 'expire', 'refund'),
        allowNull: false,
        defaultValue: 'pending',
      },
      jangka_waktu: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jatuh_tempo: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nama_bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomor_rekening: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nama_pemilik_rekening: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status_pengembalian: {
        type: DataTypes.ENUM('pending', 'finish'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'WakafBerjangka',
      tableName: 'wakaf_berjangka',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false,
      underscored: true,
    });
  return WakafBerjangka;
};
