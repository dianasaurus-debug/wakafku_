'use strict';
const { v4:uuidv4 } = require('uuid');
let data = new Array();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let idWakif = 1; idWakif <= 4; idWakif++) {
      for (let idProgramWakaf = 1; idProgramWakaf <= 6; idProgramWakaf++) {
        data.push({
          id: uuidv4(),
          program_wakaf_id: idProgramWakaf,
          wakif_id: idWakif,
          nominal: 1000000,
          nama_wakif: 'Nama Wakif' + idWakif + idProgramWakaf,
          metode_pembayaran: 'bca',
          created_at: new Date(),
          updated_at: new Date(),
        });       
      }  
    }
    await queryInterface.bulkInsert('wakaf_abadi', data);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('wakaf_abadi');
  }
};
