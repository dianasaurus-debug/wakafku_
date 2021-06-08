const WakafAbadi = require('../models').WakafAbadi;
const WakafBerjangka = require('../models').WakafBerjangka;
const Program = require('../models').Program;
const midtransClient = require('midtrans-client');
const midtransController = require('./midtrans.controller');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

module.exports = {
  displayAllWakaf(req, res) {
    const wakaf_abadi = WakafAbadi.findAll({include: ['wakif', 'program_wakaf'],});
    const wakaf_berjangka = WakafBerjangka.findAll({include: ['wakif', 'program_wakaf'],});
    Promise
      .all([wakaf_abadi, wakaf_berjangka])
      .then(responses => {
        const result = responses[0].concat(responses[1]);
        let data = _.orderBy(result, 'created_at', 'desc')
        res.send(data);
      })
      .catch(err => {
        res.send(err);
      });
  },
  getAllByUser(req, res) {
    const wakaf_abadi = WakafAbadi.findAll({
      where: {
        wakif_id: req.params.id,
      },
      include: ['wakif', 'program_wakaf'],});
    const wakaf_berjangka = WakafBerjangka.findAll({
      where: {
        wakif_id: req.params.id,
      },
      include: ['wakif', 'program_wakaf'],
    });
    Promise
      .all([wakaf_abadi, wakaf_berjangka])
      .then(responses => {
        const result = responses[0].concat(responses[1]);
        let data = _.orderBy(result, 'created_at', 'desc')
        res.send(data);
      })
      .catch(err => {
        res.send(err);
      });
  }
}
