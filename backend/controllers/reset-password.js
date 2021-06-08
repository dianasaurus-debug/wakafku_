const Wakif = require('../models').Wakif;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const Op = db.Sequelize.Op;
const config = require('../config/secret_wakif');
const clientURL = 'localhost:4000'
module.exports = {
  requestPasswordReset(email) {
    const emailUser = email;
    return Wakif.findOne({
      where : { email : emailUser}
    })
      .then((wakif) => {
        if(wakif){
          const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

          sendEmail(
            user.email,
            "Password Reset Request",
            {
              name: user.name,
              link: link,
            },
            "./template/requestResetPassword.handlebars"
          );
          return link;
        } else {
          res.status(500).send({
            error: true,
            message: 'wakif not found',
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
  },
}
