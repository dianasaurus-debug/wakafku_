const WakafAbadi = require('../models').WakafAbadi;
// const Program = require('../models').Program;
const User = require('../models').Wakif;
const WakafBerjangka = require('../models').WakafBerjangka;

const {
    sequelize
} = require('sequelize');
module.exports = {
    userBoard(req, res){
        res.status(200).send("User Content.");
    },
    displayAllUser(req, res) {
        User.findAll({
            include : [
                {model : WakafAbadi, as : "data_wakaf_abadi"},
                {model : WakafBerjangka, as : "data_wakaf_berjangka"},
            ]
        })
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while retrieving programs."
              });
          });
    },

}
