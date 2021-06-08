const multer = require('multer');
const ProgramWakaf = require('../models').ProgramWakaf;
const WakafAbadi = require('../models').WakafAbadi;
const WakafBerjangka = require('../models').WakafBerjangka;
const fileUpload= require('../middlewares/upload-image.middleware');
const fs = require('fs');
const sequelize = require('sequelize');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  hosts: [ 'http://localhost:9200']
});
const moment = require('moment')
module.exports = {
  uploadFile:function(req,res) {
    var upload = multer({
      storage: fileUpload.files.storage(),
      allowedFile:fileUpload.files.allowedFile
    }).single('file');
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send(err);
      } else if (err) {
        res.send(err);
      } else {
        const programWakaf = {
          kategori_id: req.body.kategori_id,
          judul: req.body.judul,
          deskripsi: req.body.deskripsi,
          gambar: req.file.filename,
        };

        ProgramWakaf.create(programWakaf)
          .then((data) => res.status(201).send({
            error: false,
            message: 'Berhasil menambahkan program wakaf',
            data: data
          }))
          .catch((error) => res.status(500).send({
            error: true,
            message: error,
          }));
      }
    })
  },
  displayAllPrograms(req, res) {
    ProgramWakaf.findAll({
      include: [
        'kategori', 'wakafabadi', 'wakafberjangka'
      ],
      attributes: {
        include: [
          [sequelize.literal('wakaf_abadi_terkumpul(`ProgramWakaf`.`id`)'), 'wakaf_abadi_terkumpul'],
          [sequelize.literal('wakaf_berjangka_terkumpul(`ProgramWakaf`.`id`)'), 'wakaf_berjangka_terkumpul']
        ]
      },
      order: [
        ['id', 'ASC']
      ],
    })
      .then((data) => {
        if (data.length > 0) {
          res.send({
            error: false,
            message: 'Berhasil menampilkan semua program wakaf',
            data: data
          });
        } else {
          res.status(400).send({
            error: true,
            message: 'Data program wakaf kosong',
          })
        }
      })
      .catch((error) => res.status(500).send({
        error: true,
        message: error.message,
      }));
  },
  destroyProgram(req, res){
    return ProgramWakaf
      .findByPk(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            error: true,
            message: 'Program wakaf tidak ditemukan',
          });
        } else {
          return data
            .destroy()
            .then(() => {
              let path = `public/images/${data.gambar}`
              if (fs.existsSync(path)) {
                fs.unlinkSync(path)
              }
              res.send({
                error: false,
                message: 'Berhasil menghapus program wakaf'
              });
            })
            .catch((error) => res.status(400).send({
              error: true,
              message: error.message,
            }));
        }
      })
      .catch((error) => res.status(500).send({
        error: true,
        message: error.message,
      }));
  },
  updateProgram(req, res) {
    const id = req.params.id;
    var upload = multer({
      storage: fileUpload.files.storage(),
      allowedFile:fileUpload.files.allowedFile
    }).single('file');
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send(err);
      } else if (err) {
        res.send(err);
      } else {
        let programWakaf;
        if(req.file){
          programWakaf = {
            kategori_id: req.body.kategori_id,
            judul: req.body.judul,
            deskripsi: req.body.deskripsi,
            gambar: req.file.filename,
          };
        } else {
          programWakaf = {
            kategori_id: req.body.kategori_id,
            judul: req.body.judul,
            deskripsi: req.body.deskripsi,
          };
        }
        ProgramWakaf.findByPk(id)
          .then((program) => {
            if(program){
              let path = `public/images/${program.gambar}`
              if (fs.existsSync(path)) {
                fs.unlinkSync(path)
              }
              program.update(programWakaf).then(function() {
                res.status(200).send({
                  error: false,
                  message: 'program wakaf sukses diupdate',
                })
              }).catch(function(err) {
                res.status(200).send({
                  error: true,
                  message: err.message,
                })
              });
            } else {
              res.status(500).send({
                error: true,
                message: 'program not found',
              })
            }
          })
          .catch((err) => {
            console.log('eror');
            res.status(500).send({
              error: true,
              message: err.message,
            })
          })
      }
    })
  },

  displayProgram(req, res){
    ProgramWakaf
      .findByPk(req.params.id, {
        include: ['kategori'],
      })
      .then((data) => {
        if (data) {
          res.send({
            error: false,
            message: 'Berhasil menampilkan program wakaf',
            data: data,
          });
        } else {
          res.status(400).send({
            error: true,
            message: 'Program wakaf tidak ditemukan',
          });
        }
      })
      .catch((error) => res.status(500).send({
        error: true,
        message: error.message,
      }));
  },
  cariProgram(req, res){
    // declare the query object to search elastic search and return only 200 results from the first result found.
    // also match any data where the name is like the query string sent in
    let body = {
      size: 200,
      from: 0,
      query: {
        match: {
          judul: req.query['q']
        }
      }
    }
    // perform the actual search passing in the index, the search query and the type
    client.search({index:'wakafku',  body:
        {query:
            {
              bool:
                {
                  must:
                    [
                      {bool:
                          {
                            must:
                              {
                                bool:{
                                  should:[
                                    {
                                      multi_match:
                                        {
                                          query:req.query['q'],
                                          fields:['judul','judul.raw','judul.search'],
                                          type:"best_fields",
                                          operator:"and",fuzziness:0

                                        }

                                    },
                                    {
                                      multi_match:
                                        {
                                          query:req.query['q'],
                                          fields:['judul','judul.raw','judul.search'],
                                          type:"phrase",
                                          operator:"and"

                                        }

                                    },
                                    {
                                      multi_match:
                                        {
                                          query:req.query['q'],
                                          fields:['judul','judul.raw'],
                                          type:"phrase_prefix",
                                          operator:"and"

                                        }

                                    }
                                  ],
                                  minimum_should_match:1

                                }

                              }

                          }

                      }
                    ]

                }
            },
          size:10,
          _source:{
            includes:["*"],
            excludes:[]}

        }
    })
      .then(results => {
        res.send(results.hits.hits);
      })
      .catch(err=>{
        console.log(err)
        res.send([]);
      });
  }
}
