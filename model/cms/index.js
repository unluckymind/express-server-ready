"use strict";

const response = require("../../config/payload_config"),
    connection = require("../../config/connection"),
    multer = require("multer"),
    fs = require("fs"),
    path = require('path'),
    storage = multer.diskStorage({
        destination: path.join(__dirname + './../../static/images/cms'),
        filename: function (req, file, data) {
            data(null, file.fieldname + "_" + Date.now() +
                path.extname(file.originalname));
        }
    });

exports.index = (req, res) => {
    connection.query("SELECT * FROM banners", (errorQuery, payload) => {
        errorQuery ? response.err({ code: errorQuery.code }, errorQuery) : response.ok({ data: payload }, res)
    });
};

exports.id = (req, res) => {
    const id = req.params.id
    connection.query("SELECT * FROM banners WHERE id = " + id, (error, payload) => {
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

exports.update = (req, res) => {
    const saveToFolder = multer({ storage: storage }).single("image")
    const id = req.body.id
    let checkingId = null

    saveToFolder(req, res, (errorSavingFile) => {
        connection.query(`SELECT image FROM banners WHERE id = '${req.body.id}'`, (err, old) => {
            console.log(old[0].image)
            if (old[0].Image != "") {
                fs.unlink("./static/images/cms/" + old[0].image, (errorRemovingFile) => {
                    if (errorRemovingFile) {
                        response.err({ code: errorRemovingFile.code }, res);
                    }
                });
            }
        });
        if (errorSavingFile) {
            return response.err({ message: "upload to server fail..." }, res);
        } else {
            connection.query(`UPDATE banners SET title = '${req.body.title}', image = '${req.file.filename}', status = '${req.body.status}', updated_at = now() where id = '${req.body.id}'`, (errorQuery, payload) => {
                errorQuery ? response.err({ code: errorQuery.code }, res) : response.ok({ data: payload.affectedRows }, res)
            });
        }
    })
}

exports.remove = (req, res) => {
    const id = req.body.id
    connection.query("DELETE FROM banners WHERE id = " + id, (error, payload) => {
        error ? response.err({ code: error.code }, error) : response.ok({ data: payload.affectedRows }, res)
    });
};