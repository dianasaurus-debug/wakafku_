const WakafBerjangka = require('../models').WakafBerjangka;
const Program = require('../models').ProgramWakaf;
const Wakif = require('../models').Wakif;
const midtransClient = require('midtrans-client');
const midtransController = require('./midtrans.controller');
const { v4: uuidv4 } = require('uuid');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  hosts: [ 'http://localhost:9200']
});
const moment = require('moment')
function getJatuhTempo(jangkaWaktu) {
    const jatuhTempo = new Date();
    jatuhTempo.setFullYear(jatuhTempo.getFullYear() + parseInt(jangkaWaktu));
    return jatuhTempo;
}

module.exports = {
    createWakafBerjangka:function(req,res) {
        let wakafBerjangka = {
            nominal: req.body.nominal,
            atas_nama: req.body.atas_nama,
            metode_pembayaran: req.body.metode_pembayaran,
            UserId: req.body.UserId,
            ProgramId: req.body.ProgramId,
            rekening_pengembalian: req.body.rekening_pengembalian,
            atas_nama_bank: req.body.atas_nama_bank,
            tahun_pengembalian: req.body.tahun_pengembalian,
            bank_pengembalian: req.body.bank_pengembalian,
        };
        // initialize snap client object
        let snap = new midtransClient.Snap({
            isProduction : false,
            serverKey : 'SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA',
            clientKey : 'SB-Mid-client-61XuGAwQ8Bj8LxSS'
        });
        let parameter = {
            "transaction_details": {
                "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
                "gross_amount": wakafBerjangka.nominal,
            }, "credit_card":{
                "secure" : true
            }
        };
        let transactionResult = null;
        // Save Tutorial in the database
        WakafBerjangka.create(wakafBerjangka)
          .then(data => {
              Program.findByPk(wakafBerjangka.ProgramId)
                .then(res=>{
                    return res.increment('terkumpul', {by: wakafBerjangka.nominal})
                }).catch(err=> {
                  res.send('failed to update collected money')
              })
              snap.createTransactionToken(parameter)
                .then((transactionToken)=>{
                    transactionResult = {
                        token: transactionToken,
                        clientKey: snap.apiConfig.clientKey
                    }
                    res.send(
                      {
                          "response" : {
                              "data" : data,
                              "transactionData" : transactionResult,
                          }
                      }
                    );
                }).catch(err=>{
                  console.log('Transaction Token can not be retrieved '+err);
              })
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the Wakaf Berjangka."
              });
          });

    },
    displayAllWakaf(req, res) {
        WakafBerjangka.findAll({
            include : [
                {model : Program, as : "program_wakaf"},
                {model : Wakif, as : "wakif"},
            ]
        })
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while retrieving wakaf."
              });
          });
    },
    displayWakaf(req, res){
        WakafBerjangka.findByPk(req.params.id, {
            include: [{
                model: Program,as: "program_wakaf"
            }]})
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message: "Error retrieving Wakaf Berjangka with id=" + id
              });
          });
    },
    createNewWakafBerjangka(req, res) {
        const data = req.body;
        WakafBerjangka.create({
            id: uuidv4(),
            program_wakaf_id: data.program_wakaf_id,
            wakif_id: req.data_wakif.id,
            nominal: data.nominal,
            nama_wakif: data.nama_wakif,
            metode_pembayaran: data.metode_pembayaran,
            jangka_waktu: data.jangka_waktu,
            jatuh_tempo: getJatuhTempo(data.jangka_waktu),
            nama_bank: data.nama_bank,
            nomor_rekening: data.nomor_rekening,
            nama_pemilik_rekening: data.nama_pemilik_rekening,
        })
          .then((result) => {
              console.log(result);
              req.data_wakaf = result;
              req.data_wakaf.jenis_wakaf = 'B';
              if (data.jenis_pembayaran === 'cstore') {
                  midtransController.createCStorePayment(req, res);
              } else if (data.jenis_pembayaran === 'bank') {
                  midtransController.createBankTransferPayment(req, res);
              } else if (data.jenis_pembayaran === 'qris') {
                  midtransController.createQrisPayment(req, res);
              }
          })
          .catch((error) => res.status(500).send({
              error: true,
              message: error.message,
          }));
    },
    getAllByUser(req, res) {
        WakafBerjangka.findAll({
            where: {
                wakif_id: req.params.id,
            },
            include: ['wakif', 'program_wakaf'],
        })
          .then((data) => {
              if (data.length > 0) {
                  res.send({
                      error: false,
                      message: 'Berhasil menampilkan seluruh data wakaf berjangka',
                      data: data,
                  });
              } else {
                  res.send({
                      error: true,
                      message: 'Data wakaf berjangka kosong',
                  });
              }
          })
          .catch((error) => res.status(500).send({
              error: true,
              message: error.message,
          }));
    },
    wakafBerjangkaGrafik(req, res) {
      if (req.params.startdate != 'none' && req.params.enddate != 'none') {
        client.search({
          index: 'wakaf_berjangka',
          body: {
            aggs: {
              "data": {
                date_histogram: {
                  field: "created_at",
                  fixed_interval: "12h",
                  time_zone: "Asia/Bangkok"
                },
                aggs: {
                  "terkumpul": {
                    sum: {
                      field: "nominal",
                    }
                  }
                }
              }
            },
            size: 0,
            fields: [
              {
                field: "@timestamp",
                format: "date_time"
              },
              {
                field: "created_at",
                format: "date_time"
              },
              {
                field: "updated_at",
                format: "date_time"
              }
            ],
            script_fields: {},
            stored_fields: ["*"],
            runtime_mappings: {},
            _source: {
              excludes: []
            },
            query: {
              bool: {
                must: [],
                filter: [
                  {
                    match_all: {}
                  },
                  {
                    match_all: {}
                  },
                  {
                    range: {
                      created_at: {
                        gte: req.params.startdate,
                        lte: req.params.enddate,
                        format: "strict_date_optional_time"
                      }
                    }
                  }
                ],
                should: [],
                must_not: []
              }
            }
          }
        })
          .then(function (resp) {
            var resData = resp.aggregations.data.buckets;
            var dataArray = [];
            resData.forEach(data => {
              if (data.terkumpul.value != 0)
                dataArray.push({
                  "tanggal": moment(data.key_as_string)
                    .format("DD/MM/YYYY"),
                  "count": data.terkumpul.value
                });
            })
            res.status(200)
              .send(dataArray)
          }, function (err) {
            res.status(500)
              .send({
                error: true,
                message: err.message,
              })
          })
      } else if(req.params.startdate == 'none' && req.params.enddate == 'none'){
        client.search({
          index: 'wakaf_berjangka',
          body: {
            aggs: {
              "data": {
                date_histogram: {
                  field: "created_at",
                  fixed_interval: "12h",
                  time_zone: "Asia/Bangkok"
                },
                aggs: {
                  "terkumpul": {
                    sum: {
                      field: "nominal",
                    }
                  }
                }
              }
            },
            size: 0,
            fields: [
              {
                field: "@timestamp",
                format: "date_time"
              },
              {
                field: "created_at",
                format: "date_time"
              },
              {
                field: "updated_at",
                format: "date_time"
              }
            ],
            script_fields: {},
            stored_fields: ["*"],
            runtime_mappings: {},
            _source: {
              excludes: []
            },
            query: {
              bool: {
                must: [],
                filter: [
                  {
                    match_all: {}
                  },
                  {
                    match_all: {}
                  },
                ],
                should: [],
                must_not: []
              }
            }
          }
        })
          .then(function (resp) {
            var resData = resp.aggregations.data.buckets;
            var dataArray = [];
            resData.forEach(data => {
              if (data.terkumpul.value != 0)
                dataArray.push({
                  "tanggal": moment(data.key_as_string)
                    .format("DD/MM/YYYY"),
                  "count": data.terkumpul.value
                });
            })
            res.status(200)
              .send(dataArray)
          }, function (err) {
            res.status(500)
              .send({
                error: true,
                message: err.message,
              })
          })
      }
    }
}
