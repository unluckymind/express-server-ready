"use strict";

const response = require("../../config/payload_config"),
    connection = require("../../config/connection"),
    multer = require("multer"),
    fs = require("fs"),
    path = require('path'),
    storage = multer.diskStorage({
        destination: path.join(__dirname + './../../static/images/cms'),
        filename: function (req, file, data) {
            data(null, file.fieldname + Date.now() +
                path.extname(file.originalname));
        }
    });

exports.index = (req, res) => {
    connection.query("SELECT * FROM banners", (error, payload) => {
        error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
    });
};

exports.save = (req, res) => {
    const saveToFolder = multer({ storage: storage }).single("image")
    saveToFolder(req, res, () => {
        const datas = {
            title: req.body.title,
            image: req.file.filename,
            status: req.body.status,
        }
        connection.query("INSERT INTO banners SET created_at = now(), ?", datas, (error, payload) => {
            if (error) {
                response.err({ code: error.code }, res)
            } else {
                response.ok({ data: payload.affectedRows }, res)
            }
        })
    })
}