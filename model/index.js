"use strict";

const response = require("../config/payload_config");

exports.index = (req, res) => {
    response.ok({ data: "API v1 Ready!" }, res)
};

exports.main = (req, res) => {
    response.ok({ data: ["current RESTful API version: sahabat-halosis-v1", "requirement: authentic bearer code"] }, res)
};