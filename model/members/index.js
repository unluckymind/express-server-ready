"use strict";

const db = require("../../helpers/query"),
      response = require("../../config/payload_config"),
      connection = require("../../config/connection"),
      randtoken = require("rand-token"),
      bcrypt = require("bcrypt"),
      multer = require("multer"),
      maxSize = 5 * 1024 * 1024,
      fs = require("fs"),
      path = require("path"),
      storage = multer.diskStorage({
        destination: path.join(__dirname + "./../../static/images/profile"),
        filename: function(req, file, cb) {
          cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
          );
        }
      });

exports.index = (req, res) => {
  connection.query(db.SAHABAT().members.get, (error, payload) => {
    error
      ? response.err({ code: error.code }, error)
      : response.ok({ data: payload }, res);
  });
};

exports.id = (req, res) => {
  const id = req.params.id;
  connection.query(db.SAHABAT().members.getById + id, (error, payload) => {
    error
      ? response.err({ code: error.code }, error)
      : response.ok({ data: payload[0] }, res);
  });
};

exports.userList = (req, res) => {
  const id = req.params.id;
  connection.query(db.SAHABAT().members.userList + id, (error, payload) => {
    error
      ? response.err({ code: error.code }, error)
      : response.ok({ data: payload }, res);
  });
};

exports.update = (req, res) => {
  const id = req.body.id;
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender || "",
    city: req.body.city || "",
    dob: req.body.dob || null
  };

  connection.query(db.SAHABAT().members.countMember + id, (error, isExist) => {
    if (isExist[0].rowcount != 1) {
      response.err({ message: Message.MEMBER_NOT_EXIST }, res);
    } else {
      connection.query(
        db.SAHABAT(id).members.update,
        data,
        (error, payload) => {
          error
            ? response.err({ code: error.code }, res)
            : response.ok({ data: payload.affectedRows }, res);
        }
      );
    }
  });
};

exports.updatePassword = (req, res) => {
  bcrypt.hash(req.body.verifyPassword, 10, function (err, hash) {
    const id = req.body.id;
    let insertPassword = {
      password: hash
    };
    let oldPassword = req.body.oldPassword,
      newPassword = req.body.newPassword,
      verifyPassword = req.body.verifyPassword,
      dbPassword = "";

    if (!id || !oldPassword) {
      response.err({ message: Message.INVALID_REQ }, res);
    } else {
      connection.query(db.SAHABAT().members.getById + id, (error, datas) => {
        dbPassword = datas[0].password;
        bcrypt.compare(oldPassword, dbPassword, function (err, result) {
          if (result == true) {
            if (verifyPassword != newPassword) {
              response.err({ message: Message.INVALID_REQ }, res);
            } else {
              connection.query(
                db.SAHABAT(id).members.updatePassword,
                insertPassword,
                (error, payload) => {
                  error
                    ? response.err({ code: error.code }, res)
                    : response.ok({ data: payload.affectedRows }, res);
                }
              );
            }
          } else {
            response.err({ message: Message.INVALID_REQ }, res);
          }
        });
      });
    }
  });
};

exports.updateImage = (req, res) => {
  const upload = multer({ 
        storage: storage,
        limits: { fileSize: maxSize } 
    }).single("image");

  upload(req, res, function(error) {
    if (!req.file) {
      response.err({ message: "no image attached or image too large" }, res)      
    } else {
      let insertImage = {
        image: req.file.filename
      };
      connection.query(db.SAHABAT().members.getById + req.body.id, (err, result) => {
          const oldImage = result[0].image;
          if (oldImage != null) {
            fs.unlink("./static/images/profile/" + oldImage, err => {
              if (err) throw err;
            });
          }
        }
      );
      if (error) {
        return response.err({ message: Message.UPLOAD_FAILED }, res);
      } else {
        connection.query(
          db.SAHABAT(req.body.id).members.updateImage,
          insertImage,
          (error, payload) => {
            error
              ? response.err({ code: error.code }, res)
              : response.ok({ data: payload.affectedRows }, res);
          }
        );
      }
    }
  });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    response.err(
      {
        message: Message.INVALID_REQ
      },
      res
    );
  } else {
    connection.query(db.SAHABAT().members.getPasswordByEmail + "'" + email + "'",
      (error, payload) => {
        error ? response.err({ code: error.code }, error) : payload.length > 0
          ? bcrypt.compare(password, payload[0].password, (err, result) => {
            if (result == true) {
              connection.query(db.SAHABAT().members.getMemberByEmail + "'" + email + "'",
                (error, payload) => {
                  error ? response.err({ code: error.code }, error) : response.ok({ data: payload[0] }, res);
                }
              );
            } else {
              response.err({ message: Message.INVALID_REQ }, res);
            }
          })
          : response.err({ message: Message.INVALID_REQ }, res);
      }
    );
  }
};

exports.register = (req, res) => {
  const generateCode = randtoken.generate(6);
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
      status: 1
    };


    if (req.body.code && req.body.password && req.body.email) {
      let users = "";
      let id = "";
      connection.query(db.SAHABAT().members.getIdByCode + "'" + req.body.code + "'",
        (error, userData) => {
          if (error) {
            response.err({ code: error.code }, res);
          }
          connection.query(db.SAHABAT().members.countByEmail + "'" + req.body.email + "'", (error, validation) => {

            if (validation[0].emailExist > 0) {
              response.err({ message: Message.INVALID_REQ }, res);
            } else {
              if (userData[0]) {
                users = userData[0].id;
                connection.query(db.SAHABAT().members.insertMember, dataMember, (error, memberData) => {
                  if (error) {
                    response.err({ code: error.code }, res);
                  }
                  id = memberData.insertId;
                  connection.query(db.SAHABAT(users, id).members.insertMemberUser, (err, payload) => {
                    connection.query(db.SAHABAT().members.getIdCodeById + users, (error, payload) => {
                      error ? response.err({ code: error.code }, res)
                        : response.ok({ data: { id: payload[0].id, code: payload[0].code } }, res);
                    });
                  });
                });
              } else {
                response.err({ message: Message.INVALID_REFERRAL_CODE }, res);
              }
            }
          }
          );
        }
      );
    } else {
      connection.query(db.SAHABAT().members.countByEmail + "'" + req.body.email + "'",
        (error, validation) => {
          if (validation[0].emailExist > 0) {
            response.err({ message: Message.EMAIL_EXIST }, res);
          } else {
            connection.query(
              db.SAHABAT().members.insertMember, dataMember,
              (error, payload) => {
                const id = payload.insertId;
                connection.query(db.SAHABAT().members.getIdCodeById + id,
                  (error, payload) => {
                    error ? response.err({ code: error.code }, res)
                      : response.ok({ data: { id: payload[0].id, code: payload[0].code } }, res);
                  });
              }
            );
          }
        }
      );
    }
  });
};
