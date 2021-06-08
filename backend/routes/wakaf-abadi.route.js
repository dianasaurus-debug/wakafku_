const wakafAbadiController = require('../controllers/wakaf-abadi.controller');
const adminValidator = require('../middlewares/admin-validator.middleware');
const wakifValidator = require('../middlewares/wakif-validator.middleware');

module.exports = (app) => {
    // END POINT WAKAF ABADI UNTUK WAKIF
    app.post('/api/wakaf-abadi/', wakifValidator.verifyToken, wakifValidator.getWakifData, wakafAbadiController.createNewWakafAbadi);
    app.get('/api/wakaf-abadi/:id', wakifValidator.verifyToken, wakifValidator.getWakifData, wakafAbadiController.getAllByUser);

    //END POINT WAKAF ABADI UNTUK ADMIN

    app.get('/api/admin/wakaf-abadi/grafik/startdate/:startdate/enddate/:enddate',  adminValidator.verifyToken,wakafAbadiController.wakafAbadiGrafik);
    app.get('/api/admin/wakaf-abadi/all', adminValidator.verifyToken, wakafAbadiController.displayAllWakaf);
    app.get('/api/admin/wakaf-abadi/all/:id', adminValidator.verifyToken, wakafAbadiController.getAllByUser);
    app.get('/api/admin/wakaf-abadi/:id', adminValidator.verifyToken, wakafAbadiController.displayWakaf);
}
