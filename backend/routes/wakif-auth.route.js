const wakifAuthController = require('../controllers/wakif-auth.controller');
const validator = require('../middlewares/validator');
const wakifValidator = require('../middlewares/wakif-validator.middleware');

module.exports = (app) => {
    app.put('/api/wakif-auth/update/:id', wakifValidator.verifyToken, wakifAuthController.update);
    app.put('/api/wakif-auth/update/password/:id', wakifValidator.verifyToken, wakifAuthController.updatePassword);
    app.post('/api/wakif-auth/register', validator.validateUserRegistration, wakifAuthController.checkDuplicateEmail, wakifAuthController.register);
    app.post('/api/wakif-auth/login', wakifAuthController.login);
    app.post("/api/wakif-auth/requestResetPassword", wakifAuthController.requestPasswordReset);
    app.post("/api/wakif-auth/resetPassword", wakifAuthController.resetPassword);
}
