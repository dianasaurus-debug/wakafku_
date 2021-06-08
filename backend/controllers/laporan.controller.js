const multer = require('multer');
const Laporan = require('../models').Laporan;

var fileUpload= require('../middlewares/upload-image.middleware');
const fs = require('fs');
module.exports = {
  uploadFile:function(req,res){
    var upload = multer({
      storage: fileUpload.files.storage(),
      allowedFile:fileUpload.files.allowedFile
    }).single('file');
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send(err);
      } else if (err) {
        res.send(err);
      }else{
        let laporan = {
          deskripsi: req.body.deskripsi,
          gambar: req.file.filename,
          ProgramId : req.body.ProgramId,
        };

        // Save Tutorial in the database
        Laporan.create(laporan)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Laporan."
            });
          });
      }
    })
  },
  displayAllLaporan(req, res) {
    Laporan.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving laporan."
        });
      });
  },
  destroyLaporan(req, res){
    return Laporan
      .findByPk(req.params.id)
      .then(laporan => {
        fs.unlinkSync(`public/images/${laporan.gambar}`);
        if (!laporan) {
          return res.status(400).send({
            message: 'Laporan Not Found',
          });
        }
        return laporan
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  displayLaporan(req, res){
    Laporan.findByPk(req.params.id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Laporan with id=" + req.params.id
        });
      });
  },
  displayLaporanBasedProgram(req, res){
    Laporan.findAll({
      where: {
        ProgramId: req.params.id
      }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Laporan with id=" + id
        });
      });
  }
}
