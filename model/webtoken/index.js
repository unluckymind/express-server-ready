"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const jwtconfig = require("./config");
const fs = require('fs');
const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');
var request = require("request");
const options = {
    issuer: "halosis",
    subject: "dea.aprizal@gmail.com",
    audience: "http://halosis.co.id",
    expiresIn: "30d",    // 30 days validity
    algorithm: "RS256"
};

exports.index = (req, res) => {
    connection.query("SELECT * FROM users", (error, payload) => {
        const token = jwtconfig.sign({ data: payload }, privateKEY, options)
        error ? response.err(error, res) : response.ok({ token: token }, res)
    });
};

exports.apikey = (req, res) => {
    var options = {
        method: 'POST',
        url: 'https://dev-sahabathalosis.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: '{"client_id":"hHHt9M1y5f42wr7HeJTIRs4Jl5CI5ErJ","client_secret":"yScm_qk0XrEQek5pO0nJW2xMTMSEkqVP3n0EiPs2I4P34nNPPsZmF1vPF_4Uaov7","audience":"https://sh-api","grant_type":"client_credentials"}'
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body);
    })
}

// const verify = jwtconfig.verify(token, publicKEY, verifyOptions)
// const decode = jwtconfig.decode(token, publicKEY, verifyOptions)