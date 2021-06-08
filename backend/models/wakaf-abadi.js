'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WakafAbadi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WakafAbadi.belongsTo(models.ProgramWakaf, {
        foreignKey: 'program_wakaf_id',
        targetKey: 'id',
        as: 'program_wakaf',
      });
      WakafAbadi.belongsTo(models.Wakif, {
        foreignKey: 'wakif_id',
        targetKey: 'id',
        as: 'wakif',
      });
    }
  };
  WakafAbadi.init({
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
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['capture', 'settlement', 'pending', 'deny', 'cancel', 'expire', 'refund'],
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
      modelName: 'WakafAbadi',
      tableName: 'wakaf_abadi',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false,
      underscored: true,
    });
  return WakafAbadi;
};
