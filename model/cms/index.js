"use strict";

const response = require("../../config/payload_config"),
  connection = require("../../config/connection"),
  db = require("../../helpers/query"),
  multer = require("multer"),
  fs = require("fs"),
  path = require("path"),
  Message = require("../../helpers/messages"),
  storage = multer.diskStorage({
    destination: path.join(__dirname + "./../../static/images/cms"),
    filename: function (req, file, data) {
      data(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    }
  });

exports.index = (req, res) => {
  connection.query(db.CMS().banners.get, (errorQuery, payload) => {
    errorQuery
      ? response.err({ code: errorQuery.code }, errorQuery)
      : response.ok({ data: payload }, res);
  });
};

exports.id = (req, res) => {
  const id = req.params.id;
  connection.query(db.CMS().banners.getById + id, (error, payload) => {
    error
      ? response.err({ code: error.code }, error)
      : response.ok({ data: payload }, res);
  });
};

exports.save = (req, res) => {
  const saveToFolder = multer({
    storage: storage
  }).single("image")
  saveToFolder(req, res, () => {
    const size = req.file.size
    if (!req.file) {
      response.err({ message: Message.UPLOAD_NO_IMAGE }, res)
    } else {
      const datas = {
        title: req.body.title,
        image: req.file.filename,
        status: req.body.status,
      }
      size > 5000000 ? (
        response.err({ message: Message.UPLOAD_LARGER }, res),
        fs.unlink("./static/images/cms/" + req.file.filename, err => {
          if (err) response.err({ message: Message.DELETE_IMAGE }, res);
        })
      )
        :
        connection.query(db.CMS().banners.insert, datas, (error, payload) => {
          if (error) {
            response.err({ code: error.code }, res)
          } else {
            response.ok({ data: payload.affectedRows }, res)
          }
        })
    }
  })
}

exports.update = (req, res) => {
  const saveToFolder = multer({
    storage: storage
  }).single("image")
  saveToFolder(req, res, () => {
    const size = req.file.size
    const id = req.body.id;
    if (!req.file) {

      response.err({ message: Message.UPLOAD_FAILED }, res)

    } else if(size > 5000000){

      response.err({ message: Message.UPLOAD_LARGER }, res),
      fs.unlink("./static/images/cms/" + req.file.filename, err => {
        if (err) response.err({ message: Message.DELETE_IMAGE }, res);
      })
     
    } else {

      connection.query(db.CMS().banners.getById + id, (err, old) => {
        if (old[0].Image != "") {
          fs.unlink("./static/images/cms/" + old[0].image, err => {
            if (err) response.err({ message: Message.DELETE_IMAGE }, res);
          });
        }
      });
      const datas = {
        title: req.body.title,
        image: req.file.filename,
        status: req.body.status
      };
      connection.query(db.CMS(id).banners.update, datas,
        (errorQuery, payload) => {
          errorQuery ? response.err({ code: errorQuery.code }, res) : response.ok({ data: payload.affectedRows }, res);
      });
    }
  });
};

exports.remove = (req, res) => {
  const id = req.body.id;
  connection.query(db.CMS().banners.getById + id, (err, old) => {
    if (old[0].Image != "") {
      fs.unlink("./static/images/cms/" + old[0].image, err => {
        if (err) throw err;
      });
    }
  });
  connection.query(db.CMS().banners.delete + id, (error, payload) => {
    error
      ? response.err({ code: error.code }, res)
      : response.ok({ data: payload.affectedRows }, res);
  });
};
