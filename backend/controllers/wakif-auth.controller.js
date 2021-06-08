const Wakif = require('../models').Wakif
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models/index')
const Op = db.Sequelize.Op
const config = require('../config/secret_wakif')
const Token = require('../models').Token;
const emailService = require("../utils/email/sendEmail");
const crypto = require("crypto");
const cryptoRandomString = require("crypto-random-string");
const biguint = require('biguint-format')

// const resetPasswordRequestController = async (req, res, next) => {
//   const requestPasswordResetService = await requestPasswordReset(
//     req.body.email
//   );
//   return res.json(requestPasswordResetService);
// };
//
// const resetPasswordController = async (req, res, next) => {
//   const resetPasswordService = await resetPassword(
//     req.body.userId,
//     req.body.token,
//     req.body.password
//   );
//   return res.json(resetPasswordService);
// };
module.exports = {
  // resetPasswordController,
  // resetPasswordRequestController,
  checkDuplicateEmail(req, res, next) {
    const data = req.body
    Wakif.findOne({
      where: {
        email: data.email
      }
    })
      .then((wakif) => {
        if (wakif) {
          res.status(400)
            .send({
              error: true,
              message: 'Email sudah digunakan'
            })
        } else {
          next()
        }
      })
  },
  register(req, res) {
    const data = req.body
    return Wakif.create({
      nama: data.nama,
      email: data.email,
      password: bcrypt.hashSync(data.password, 8)
    })
      .then((wakif) => res.status(201)
        .send({
          error: false,
          data: wakif,
          message: 'Berhasil registrasi akun wakif'
        }))
      .catch((error) => res.status(500)
        .send({
          error: true,
          message: error.message
        }))
  },
  update(req, res) {
    const id = req.params.id
    return Wakif.findByPk(id)
      .then((wakif) => {
        if (wakif) {
          wakif.update({
            nama: req.body.nama,
            email: req.body.email,
            nik: req.body.nik,
            nomor_ponsel: req.body.nomor_ponsel,
            alamat: req.body.alamat
          })
            .then(function () {
              res.status(200)
                .send({
                  error: false,
                  message: err.message
                })
            })
            .catch(function (err) {
              res.status(200)
                .send({
                  error: false,
                  message: err.message
                })
            })
        } else {
          res.status(500)
            .send({
              error: true,
              message: 'wakif not found'
            })
        }
      })
      .catch((err) => {
        console.log('eror')
        res.status(500)
          .send({
            error: true,
            message: err.message
          })
      })
  },
  updatePassword(req, res) {
    const id = req.params.id
    return Wakif.findByPk(id)
      .then((wakif) => {
        if (wakif) {
          const passwordIsValid = bcrypt.compareSync(req.body.password, wakif.password)
          if (!passwordIsValid) {
            return res.status(401)
              .send({
                error: true,
                message: 'Kata sandi yang dimasukkan salah'
              })
          } else {
            wakif.update({
              password: bcrypt.hashSync(req.body.new_password, 8)
            })
              .then(function () {
                res.status(200)
                  .send({
                    error: false,
                    message: 'Suda diperbaarui'
                  })
              })
              .catch(function (err) {
                res.status(200)
                  .send({
                    error: true,
                    message: err.message
                  })
              })
          }
        } else {
          res.status(500)
            .send({
              error: true,
              message: 'wakif not found'
            })
        }
      })
      .catch((err) => {
        console.log('eror')
        res.status(500)
          .send({
            error: true,
            message: err.message
          })
      })

  },
  login(req, res) {
    const data = req.body
    return Wakif.findOne({
      where: {
        email: data.email
      }
    })
      .then((wakif) => {
        if (!wakif) {
          res.status(400)
            .send({
              error: true,
              message: 'Akun wakif tidak ditemukan'
            })
        } else {
          const passwordIsValid = bcrypt.compareSync(data.password, wakif.password)
          if (!passwordIsValid) {
            return res.status(401)
              .send({
                error: true,
                message: 'Kata sandi salah'
              })
          } else {
            var token = 'Bearer ' + jwt.sign({
              id: wakif.id
            }, config.secret, {
              expiresIn: 86400 //24h expired
            })

            res.status(200)
              .send({
                error: false,
                message: 'Berhasil masuk akun wakif',
                data: wakif,
                accessToken: token
              })
          }
        }
      })
      .catch((error) => res.status(500)
        .send({
          error: true,
          message: error.message
        }))
  },
  requestPasswordReset(req, res) {
    console.log(req.body.email);
    Wakif.findOne({
      where: {
        email: req.body.email
      }}).then(user=>{
      console.log(user.email);
      if(user){
        Token.findOne({
          where: {
            email: user.email
          }}).then(token=>{
          if(token){
            token.destroy();
          }
            const code = crypto.randomBytes(3).toString("hex");
            const resetToken = parseInt(code.toString('hex'), 16).toString().substr(0,6)
            console.log(resetToken)
            const hash = bcrypt.hashSync(resetToken, 8)
            Token.create({
              email : user.email,
              token : hash,
            }).then(result=>{
              const link = resetToken;
              console.log(link);
              emailService.sendMail({
                from : 'Wakafku',
                to: user.email,
                subject: "Your Password Reset Code for YOUR APP",
                text: `Please use the following code within the next 10 minutes to reset your password on YOUR APP: ${link}`,
                html: `<p>Please use the following code within the next 10 minutes to reset your password on YOUR APP: <strong>${link}</strong></p>`,              }
              );
              res.json({ success: true });
            }).catch(err=>{
              res.status(500)
                .send({
                  error: true,
                  message: "eror buat token" + err.message
                })
            })
        }).catch(err=>{
          res.status(500)
            .send({
              error: true,
              message: err.message
            })
        })
      }
    }).catch(err=>{
      res.status(500)
        .send({
          error: true,
          message: err.message
        })
      }
    )
  },
  resetPassword (req, res){
    console.log(req.body.email, req.body.token, req.body.password);
    Token.findOne({
      where: {
        email: req.body.email
      }}).then(token=>{
      if(token){
        const isValid = bcrypt.compare(req.body.token, token.token);
        if (!isValid) {
          throw new Error("Invalid or expired password reset token");
        } else {
          const hash = bcrypt.hashSync(req.body.password, 8);
          console.log(hash);
          Wakif.findOne({
            where: {
              email: token.email
            }}).then(wakif=>{
              wakif.update(
                {
                  password : hash
                }
              ).then(user=>{
                emailService.sendMail({
                  from : 'Wakafku',
                  to: user.email,
                  subject: "Sukses Reset Password",
                  text: `Password sukses diupdate`,
                  html: `<p>Password sukses diupdate</p>`,              }
                );
                token.destroy().then(result=>{
                  res.status(200)
                    .send({
                      error: false,
                      message: "success diupdate"
                    })
                });

              }).catch(err=>{
                res.status(500)
                  .send({
                    error: true,
                    message: err.message
                  })
              })
          }).catch(err=>{
            res.status(500)
              .send({
                error: true,
                message: err.message
              })
          })
        }
      }
    })
  }


}

