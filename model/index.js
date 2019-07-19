"use strict";

const response = require("../config/payload_config");

exports.index = (req, res) => {
    response.ok({ data: "API v1 Ready!" }, res)
};