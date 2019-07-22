"use strict";

const response = require("../config/payload_config");

exports.index = (req, res) => {
    response.ok({ data: "API v1 Ready!" }, res)
};

exports.main = (req, res) => {
    response.ok({
        data: {
            version: "sahabat-halosis-v1 || dev/1.0-preprod",
            requirements: "bearer authorization"
        }
    }, res)
};