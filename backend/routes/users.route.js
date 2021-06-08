const UserController = require('../controllers/user.controller');
const wakifValidator = require('../middlewares/wakif-validator.middleware');
const adminValidator = require('../middlewares/admin-validator.middleware');


module.exports = function (app) {
  //User Auth
  app.get('/api/user/index', wakifValidator.verifyToken, UserController.userBoard);
  app.get('/api/user/all', adminValidator.verifyToken, UserController.displayAllUser);

}
