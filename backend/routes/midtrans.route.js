const midtransController = require('../controllers/midtrans.controller');

module.exports = (app) => {
    app.post('/api/midtrans/notification-handler/', midtransController.handleNotification);
    app.post('/api/midtrans/check-status/', midtransController.checkTransactionStatus);
};