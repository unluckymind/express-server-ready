"use strict";

const response = require("../config/payload_config");

exports.index = (req, res) => {
    response.ok({ payload: "API v1 Ready" }, res)
};