"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const randtoken = require('rand-token');
const bcrypt = require('bcrypt');
const multer = require("multer");
const fs = require("fs");
var path = require('path');
const storage = multer.diskStorage({
  destination: path.join(__dirname + './../../static/images/profile'),
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() +
      path.extname(file.originalname));
  }
});

exports.index = (req, res) => {
  connection.query("SELECT * FROM members", (error, payload) => {
    error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
  });
};

exports.id = (req, res) => {
  const id = req.params.id
  connection.query("SELECT * FROM members where id = " + id, (error, payload) => {
    error ? response.err({ code: error.code }, error) : response.ok({ data: payload[0] }, res)
  });
};

exports.userList = (req, res) => {
  const id = req.params.id
  connection.query("select member_users.member_user_id, members.name, members.email, members.phone, members.image, members.dob, members.city, members.gender, member_users.created_at, members.point from member_users inner join members on members.id = member_users.member_user_id where member_users.member_id = " + id, (error, payload) => {
    error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
  });
};

exports.update = (req, res) => {
  const id = req.body.id
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender || "",
    city: req.body.city || "",
    dob: req.body.dob || null
  }

  connection.query("SELECT COUNT(*) as rowcount FROM members where id = " + id, (error, isExist) => {
    if (isExist[0].rowcount != 1) {
      response.err({ message: "member is not exist" }, res)
    } else {
      connection.query(`UPDATE members SET ? where id = '${id}'`, data, (error, payload) => {
        error ? response.err({ code: error.code }, error) : response.ok({ data: payload.affectedRows }, res)
      });
    }
  });
}
exports.updatePassword = (req, res) => {
  bcrypt.hash(req.body.verifyPassword, 10, function (err, hash) {
    const id = req.body.id

    let oldPassword = req.body.oldPassword,
      newPassword = req.body.newPassword,
      verifyPassword = req.body.verifyPassword,
      dbPassword = '';

    if (!id || !oldPassword) {
      response.err({ message: "invalid data request" }, res)
    } else {
      connection.query("SELECT password FROM members where id = " + id, (error, datas) => {
        dbPassword = datas[0].password
        bcrypt.compare(oldPassword, dbPassword, function (err, result) {
          if (result == true) {
            if (verifyPassword != newPassword) {
              response.err({ message: "invalid data request" }, res)
            } else {
              connection.query(`UPDATE members SET password = '${hash}' where id = '${id}'`, (error, payload) => {
                error ? response.err({ code: error.code }, error) : response.ok({ data: payload.affectedRows }, res)
              });
            }
          } else {
            response.err({ message: "invalid data request" }, res)
          }
        });
      });
    }
  });
}

exports.updateImage = (req, res) => {
  const upload = multer({ storage: storage }).single("image");

  upload(req, res, function (error) {

    if (!req.file) {
      response.err({ message: "invalid data request" }, res)
    } else {
      connection.query(`SELECT image FROM members WHERE id = '${req.body.id}'`, (err, result) => {
        const oldImage = result[0].image;
        if (oldImage != null) {

          fs.unlink("./static/" + oldImage, (err) => {
            if (err) {
              response.err({ code: err.code }, res);
            }
          });
        }
      });

      if (error) {
        return response.err({ message: "upload error" }, res);
      } else {
        connection.query(`UPDATE members SET image = '${req.file.filename}' where id = '${req.body.id}'`, (error, payload) => {
          error ? response.err({ code: error.code }, res) : response.ok({ data: payload.affectedRows }, res)
        });
      }
    }
  });
}


exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    response.err({
      message: "invalid data request"
    }, res)
  } else {
    connection.query("SELECT password FROM members WHERE email = ?", email, (error, payload) => {
      error ? response.err({ code: error.code }, error) : payload.length > 0 ?
        bcrypt.compare(password, payload[0].password, (err, result) => {
          if (result == true) {
            connection.query("SELECT * FROM members WHERE email = ?", email, (error, payload) => {
              error ? response.err({ code: error.code }, error) : response.ok({ data: payload[0] }, res)
            })
          } else {
            response.err({ message: "invalid data request" }, res)
          }
        }) : response.err({ message: "invalid data request" }, res)
    })
  }
};

exports.register = (req, res) => {
  const generateCode = randtoken.generate(6)
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    let dataMember = {
      name: req.body.name,
      image: req.body.image,
      phone: req.body.phone,
      email: req.body.email,
      gender: req.body.gender || "",
      city: req.body.city || "",
      dob: req.body.dob || null,
      password: hash,
      code: generateCode,
      status: 1,
    }
    if (req.body.code && req.body.password && req.body.email) {
      let users = ''
      let id = ''
      connection.query("SELECT id FROM members WHERE code = " + "'" + req.body.code + "'", (error, userData) => {
        if (error) {
          response.err({ code: error.code }, res)
        }
        connection.query("SELECT COUNT(*) as emailExist FROM members WHERE email = " + "'" + req.body.email + "'", (error, validation) => {
          if (validation[0].emailExist > 0) {
            response.err({ message: "email already exist" }, res)
          } else {
            if (userData[0]) {
              users = userData[0].id
              connection.query("INSERT INTO members SET created_at = now(), ?", dataMember, (error, memberData) => {
                if (error) {
                  response.err({ code: error.code }, res)
                }
                id = memberData.insertId
                connection.query("INSERT INTO member_users (member_id, member_user_id, created_at) VALUES " + "(" + users + "," + id + "," + 'now()' + ")", (error, payload) => {
                  connection.query("SELECT id, code FROM members where id = " + users, (error, payload) => {
                    error ? response.err({ code: error.code }, res) : response.ok({ data: { id: payload[0].id, code: payload[0].code } }, res)
                  });
                })
              })
            } else {
              response.err({ message: "code tidak ditemukan" }, res)
            }
          }
        })
      });

    } else {
      connection.query("SELECT COUNT(*) as emailExist FROM members WHERE email = " + "'" + req.body.email + "'", (error, validation) => {
        if (validation[0].emailExist > 0) {
          response.err({ message: "email already exist" }, res)
        } else {
          connection.query("INSERT INTO members SET created_at = now(), ?", dataMember, (error, payload) => {
            const id = payload.insertId
            connection.query("SELECT id, code FROM members where id = " + id, (error, payload) => {
              error ? response.err({ code: error.code }, res) : response.ok({ data: { id: payload[0].id, code: payload[0].code } }, res)
            });
          });
        }
      })
    }
  });
};