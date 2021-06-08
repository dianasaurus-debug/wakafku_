const semuaWakafController = require('../controllers/semua-wakaf.controller');

module.exports = (app) => {
    // END POINT SEMUA JENIS WAKAF TERBARU
    app.get('/api/wakaf/all', semuaWakafController.displayAllWakaf);
    app.get('/api/wakaf/all/:id', semuaWakafController.getAllByUser);
}
