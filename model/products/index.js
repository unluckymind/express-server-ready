"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const db = require("../../helpers/query");

exports.index = (req, res) => {
    connection.query(db.SAHABAT().products.get, (error, payload) => {
        error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
    });
};

exports.save = (req, res) => {
    if (!req.body.member_id && !req.body.page && !req.body.ip) {
        response.err({ message: "invalid data request" }, res)
    } else {
        const dataShares = {
            member_id: req.body.member_id,
            page: req.body.page,
            ip: req.body.ip,
        }
        connection.query(db.SAHABAT().products.insert, dataShares, (error, payload) => {
            if (error) {
                response.err({ code: error.code }, res)
            } else {
                response.ok({ data: payload.affectedRows }, res)
            }
        })
    }
}

exports.member_id = (req, res) => {
    const member_id = req.params.member_id
    connection.query(db.SAHABAT().products.getByMemberId + member_id, (error, payload) => {
        error ? response.err({ code: error.code }, res) :
        response.ok({ data: payload }, res)
    });
};