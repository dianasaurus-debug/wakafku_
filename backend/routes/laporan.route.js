const LaporanController = require('../controllers/laporan.controller');
const AuthAdminMiddleware = require('../middlewares/admin-validator.middleware');

module.exports = function (app) {
  //User Auth
  app.post('/api/laporan',AuthAdminMiddleware.verifyToken, LaporanController.uploadFile);
  app.get('/api/laporan/all', LaporanController.displayAllLaporan);
  app.delete('/api/laporan/:id',AuthAdminMiddleware.verifyToken, LaporanController.destroyLaporan);
  app.get('/api/laporan/view/:id', LaporanController.displayLaporan);
  app.get('/api/laporan/view/byprogram/:id', LaporanController.displayLaporanBasedProgram);

}
