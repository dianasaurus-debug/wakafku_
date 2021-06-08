const WakafAbadi = require('../models').WakafAbadi;
const WakafBerjangka = require('../models').WakafBerjangka;
const midtransClient = require('midtrans-client');
let coreApi = new midtransClient.CoreApi();
coreApi.apiConfig.isProduction = false;
coreApi.apiConfig.serverKey = 'SB-Mid-server-e4XJJ3-QK_WKD9R-XAmvU1cS';
coreApi.apiConfig.clientKey = 'SB-Mid-client-1ldNQUjGzVJ7Dc-R';

function updatePaymentCode(jenisWakaf, idTransaksiWakaf, paymentCode) {
    if (jenisWakaf === 'A') {
        WakafAbadi.update({
            kode_pembayaran: paymentCode,
        },
        {
            where: {
                id: idTransaksiWakaf,
            }
        });
    } else {
        WakafBerjangka.update({
            kode_pembayaran: paymentCode,
        },
        {
            where: {
                id: idTransaksiWakaf,
            }
        });
    }
}

function updateStatus(id, status) {
    const jenisWakaf = id.charAt(0);
    const idTransaksi = id.substring(2);
    if (jenisWakaf === 'A') {
        WakafAbadi.update({
            status_pembayaran: status,
        },
        {
            where: {
                id: idTransaksi,
            }
        });
    } else {
        WakafBerjangka.update({
            status_pembayaran: status,
        },
        {
            where: {
                id: idTransaksi,
            }
        });
    }
}

module.exports = {
    createBankTransferPayment(req, res) {
        const dataWakif = req.data_wakif;
        const dataWakaf = req.data_wakaf;
        coreApi.charge({
            "payment_type": "bank_transfer",
            "transaction_details": {
                "gross_amount": req.body.nominal,
                "order_id": dataWakaf.jenis_wakaf + "-" + dataWakaf.id,
            },
            "customer_details": {
                "first_name": dataWakif.nama,
                "email": dataWakif.email,
                "phone": dataWakif.nomor_telepon,
            },
            "bank_transfer": {
                "bank": dataWakaf.metode_pembayaran,
            }
        })
        .then((response) => {
            console.log(response);
            const payment_code = response.va_numbers[0].va_number;
            dataWakaf.kode_pembayaran = payment_code;
            if (dataWakaf.jenis_wakaf === 'A') {
                updatePaymentCode(dataWakaf.jenis_wakaf, dataWakaf.id, payment_code);
                res.status(201).send({
                    error: false,
                    message: 'Berhasil membuat transaksi wakaf abadi',
                    data: dataWakaf,
                });
            } else {
                updatePaymentCode(dataWakaf.jenis_wakaf, dataWakaf.id, payment_code);
                res.status(201).send({
                    error: false,
                    message: 'Berhasil membuat transaksi wakaf berjangka',
                    data: dataWakaf,
                });
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send({
                error: true,
                message: error.ApiResponse,
            })
        });
    },
    createCStorePayment(req, res) {
        const dataWakif = req.data_wakif;
        const dataWakaf = req.data_wakaf;
        coreApi.charge({
            "payment_type": "cstore",
            "transaction_details": {
                "gross_amount": req.body.nominal,
                "order_id": dataWakaf.jenis_wakaf + "-" + dataWakaf.id,
            },
            "customer_details": {
                "first_name": dataWakif.nama,
                "email": dataWakif.email,
                "phone": dataWakif.nomor_telepon,
            },
            "cstore": {
                "store": dataWakaf.metode_pembayaran,
            }
        })
        .then((response) => {
            const payment_code = response.payment_code;
            dataWakaf.kode_pembayaran = payment_code;
            if (dataWakaf.jenis_wakaf === 'A') {
                updatePaymentCode(dataWakaf.jenis_wakaf, dataWakaf.id, payment_code);
                res.status(201).send({
                    error: false,
                    message: 'Berhasil membuat transaksi wakaf abadi',
                    data: dataWakaf,
                });
            } else {
                updatePaymentCode(dataWakaf.jenis_wakaf, dataWakaf.id, payment_code);
                res.status(201).send({
                    error: false,
                    message: 'Berhasil membuat transaksi wakaf berjangka',
                    data: dataWakaf,
                });
            }
        })
        .catch((error) => {
              console.log(error.ApiResponse)
              res.status(500).send({
                  error: true,
                  message: error.ApiResponse,
              })
        }
          );
    },
    createQrisPayment(req, res) {
        const dataWakif = req.data_wakif;
        const dataWakaf = req.data_wakaf;
        coreApi.charge({
            "payment_type": "gopay",
            "transaction_details": {
                "gross_amount": req.body.nominal,
                "order_id": dataWakaf.jenis_wakaf + "-" + dataWakaf.id,
            },
            "customer_details": {
                "first_name": dataWakif.nama,
                "email": dataWakif.email,
                "phone": dataWakif.nomor_telepon,
            },
        })
        .then((response) => {
            const payment_code = response.actions[0].url;
            dataWakaf.kode_pembayaran = payment_code;
            if (dataWakaf.jenis_wakaf === 'A') {
                updatePaymentCode(dataWakaf.jenis_wakaf, dataWakaf.id, payment_code);
                res.status(201).send({
                    error: false,
                    message: 'Berhasil membuat transaksi wakaf abadi',
                    data: dataWakaf,
                });
            } else {
                updatePaymentCode(dataWakaf.jenis_wakaf, dataWakaf.id, payment_code);
                res.status(201).send({
                    error: false,
                    message: 'Berhasil membuat transaksi wakaf berjangka',
                    data: dataWakaf,
                });
            }
        })
        .catch((error) => res.status(500).send({
            error: true,
            message: error.apiResponse,
        }));
    },
    handleNotification(req, res) {
        const data = req.body;
        coreApi.transaction.notification(data)
        .then((transaction) => {
            const orderId = transaction.order_id;
            const transactionStatus = transaction.transaction_status;
            const fraudStatus = transaction.fraud_status;
            const summary = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.`;

            if (transactionStatus == 'capture'){
                if (fraudStatus == 'challenge'){
                    updateStatus(orderId, 'challenge');
                } else if (fraudStatus == 'accept'){
                    updateStatus(orderId, 'success');
                }
            } else if (transactionStatus == 'settlement'){
                updateStatus(orderId, 'success');
            } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
                updateStatus(orderId, 'failure');
            } else if (transactionStatus == 'pending'){
                updateStatus(orderId, 'pending');
            } else if (transactionStatus == 'refund'){
                updateStatus(orderId, 'refund');
            }
            res.send(summary);
        })
        .catch((error) => res.status(500).send({
            error: true,
            message: error.message,
        }));
    },
    checkTransactionStatus(req, res) {
        coreApi.transaction.status(req.body.transaction_id)
        .then((transaction) => {
            const orderId = transaction.order_id;
            const transactionStatus = transaction.transaction_status;
            const fraudStatus = transaction.fraud_status;
            const summary = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.`;

            if (transactionStatus == 'capture'){
                if (fraudStatus == 'challenge'){
                    updateStatus(orderId, 'challenge');
                } else if (fraudStatus == 'accept'){
                    updateStatus(orderId, 'success');
                }
            } else if (transactionStatus == 'settlement'){
                updateStatus(orderId, 'success');
            } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
                updateStatus(orderId, 'failure');
            } else if (transactionStatus == 'pending'){
                updateStatus(orderId, 'pending');
            } else if (transactionStatus == 'refund'){
                updateStatus(orderId, 'refund');
            }
            res.send(summary);
        })
        .catch((error) => res.status(500).send({
            error: true,
            message: error.message,
        }));
    }
};
