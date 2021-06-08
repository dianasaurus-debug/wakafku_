const programController = require('../controllers/program-wakaf.controller');
const adminValidator = require('../middlewares/admin-validator.middleware');
const wakifValidator = require('../middlewares/wakif-validator.middleware');

module.exports = function (app) {
    // END POINT PROGRAM WAKAF UNTUK WAKIF
    app.get('/api/program-wakaf/cari', programController.cariProgram);
    app.get('/api/program-wakaf/all', wakifValidator.verifyToken, programController.displayAllPrograms);
    app.get('/api/program-wakaf/all/public', programController.displayAllPrograms);
    app.get('/api/program-wakaf/view/:id', wakifValidator.verifyToken, programController.displayProgram);

    // END POINT PROGRAM WAKAF UNTUK ADMIN
    app.post('/api/admin/program-wakaf', adminValidator.verifyToken, programController.uploadFile);
    app.get('/api/admin/program-wakaf/all', adminValidator.verifyToken, programController.displayAllPrograms);
    app.delete('/api/admin/program-wakaf/:id', adminValidator.verifyToken, programController.destroyProgram);
    app.put('/api/admin/program-wakaf/:id', adminValidator.verifyToken, programController.updateProgram);
    app.get('/api/admin/program-wakaf/view/:id', adminValidator.verifyToken, programController.displayProgram);
}
