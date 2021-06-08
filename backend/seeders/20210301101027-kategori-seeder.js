'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('kategori', [
    {
      nama: 'Pendidikan',
      deskripsi: 'Deskripsi program wakaf pendidikan',
      gambar: 'pendidikan.png',
      ikon_flutter: 'Icons.pendidikan',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      nama: 'Kesehatan',
      deskripsi: 'Deskripsi program wakaf kesehatan',
      gambar: 'kesehatan.png',
      ikon_flutter: 'Icons.kesehatan',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      nama: 'Tempat Ibadah',
      deskripsi: 'Deskripsi program wakaf tempat ibadah',
      gambar: 'tempat-ibadah.png',
      ikon_flutter: 'Icons.tempat_ibadah',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      nama: 'Umum',
      deskripsi: 'Deskripsi program wakaf umum',
      gambar: 'umum.png',
      ikon_flutter: 'Icons.umum',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      nama: 'Donasi Bencana',
      deskripsi: 'Deskripsi program wakaf donasi bencana',
      gambar: 'donasi-bencana.png',
      ikon_flutter: 'Icons.donasi_bencana',
      created_at: new Date(),
      updated_at: new Date(),
    },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('kategori');
  }
};
