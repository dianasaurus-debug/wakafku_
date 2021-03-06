const WakafAbadi = require('../models').WakafAbadi;
const Program = require('../models').ProgramWakaf;
const midtransClient = require('midtrans-client');
const midtransController = require('./midtrans.controller');
const { v4: uuidv4 } = require('uuid');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  hosts: [ 'http://localhost:9200']
});
const moment = require('moment')
module.exports = {
    displayAllWakaf(req, res) {
        WakafAbadi.findAll({
            include :
                [
                  {model : Program, as : "program_wakaf"},
                  'wakif'
                ]
        })
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while retrieving  wakaf abadi."
              });
          });
    },

    displayWakaf(req, res) {
        WakafAbadi.findByPk(req.params.id, {
            include: [
              {model : Program, as : "program_wakaf"},
              'wakif'
            ]})
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message: "Error retrieving  wakaf abadi with id=" + id
              });
          });
    },
    createNewWakafAbadi(req, res) {
        const data = req.body;
        WakafAbadi.create({
            id: uuidv4(),
            program_wakaf_id: data.program_wakaf_id,
            wakif_id: data.wakif_id,
            nominal: data.nominal,
            nama_wakif: data.nama_wakif,
            metode_pembayaran: data.metode_pembayaran,
        })
          .then((result) => {
              // console.log(result);
              req.data_wakaf = result;
              req.data_wakaf.jenis_wakaf = 'A';
              if (data.jenis_pembayaran === 'cstore') {
                console.log('olla');
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
        WakafAbadi.findAll({
            where: {
                wakif_id: req.params.id,
            },
            include: ['wakif', 'program_wakaf'],
        })
          .then((data) => {
              if (data.length > 0) {
                  res.send({
                      error: false,
                      message: 'Berhasil menampilkan seluruh data wakaf abadi',
                      data: data,
                  });
              } else {
                  res.send({
                      error: true,
                      message: 'Data wakaf abadi kosong',
                  });
              }
          })
          .catch((error) => res.status(500).send({
              error: true,
              message: error.message,
          }));
    },
    wakafAbadiGrafik(req, res){
      if(req.params.startdate != 'none' && req.params.enddate != 'none'){
        client.search({
          index: 'wakaf_abadi',
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
        }).then(function (resp) {
          var resData = resp.aggregations.data.buckets;
          var dataArray = [];
          resData.forEach(data=>{
            if(data.terkumpul.value!=0)
              dataArray.push({"tanggal": moment(data.key_as_string).format("DD/MM/YYYY") , "count" : data.terkumpul.value});
          })
          res.status(200).send(dataArray)
        }, function (err) {
          res.status(500).send({
            error: true,
            message: err.message,
          })
        })
      } else if(req.params.startdate == 'none' && req.params.enddate == 'none'){
        client.search({
          index: 'wakaf_abadi',
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
                    match_phrase: {
                      status_pembayaran: "success"
                    }
                  },
                  // {
                  //   range: {
                  //     created_at: {
                  //       gte: "2021-03-08T23:26:06.681Z",
                  //       lte: "2021-06-06T23:26:06.681Z",
                  //       format: "strict_date_optional_time"
                  //     }
                  //   }
                  // }

                ],
                should: [],
                must_not: []
              }
            }
          }
        }).then(function (resp) {
          var resData = resp.aggregations.data.buckets;
          var dataArray = [];
          resData.forEach(data=>{
            if(data.terkumpul.value!=0)
              dataArray.push({"tanggal": moment(data.key_as_string).format("DD/MM/YYYY") , "count" : data.terkumpul.value});
          })
          res.status(200).send(dataArray)
        }, function (err) {
          res.status(500).send({
            error: true,
            message: err.message,
          })
        })
      }
      }

}
