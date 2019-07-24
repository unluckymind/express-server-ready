"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");

let time = new Date()

exports.index = (req, res) => {
    connection.query("SELECT * FROM log_shares", (error, payload) => {
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
        connection.query("INSERT INTO log_shares SET created_at = now(), ?", dataShares, (error, payload) => {
            if (error) {
                response.err({ code: error.code }, res)
            } else {
                response.ok({ data: payload.affectedRows }, res)
            }
        })
    }
}