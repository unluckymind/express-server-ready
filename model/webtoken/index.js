"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const jwtconfig = require("./config");
const fs = require('fs');
const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');

const signOptions = {
    issuer: "halosis",
    subject: "dea.aprizal@gmail.com",
    audience: "http://halosis.co.id",
    expiresIn: "30d",    // 30 days validity
    algorithm: "RS256"
};

const verifyOptions = {
    issuer: "halosis",
    subject: "dea.aprizal@gmail.com",
    audience: "http://halosis.co.id",
    expiresIn: "30d",    // 30 days validity
    algorithm: "RS256"
};

exports.index = (req, res) => {
    connection.query("SELECT * FROM users", (error, payload) => {
        const token = jwtconfig.sign({ data: payload }, privateKEY, signOptions)
        error ? response.err(error, res) : response.ok({ token: token }, res)
    });
};

// const verify = jwtconfig.verify(token, publicKEY, verifyOptions)
// const decode = jwtconfig.decode(token, publicKEY, verifyOptions)