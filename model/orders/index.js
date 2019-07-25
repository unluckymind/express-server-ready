"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");

exports.index = (req, res) => {
    connection.query("SELECT * FROM orders", (error, payload) => {
      error ? response.err({ code: error.code }, res) : response.ok({ data: payload }, res)
    });
  };
  
exports.customer_phone = (req, res) => {
    const customer_phone = req.params.customer_phone
    connection.query("SELECT * FROM orders where customer_phone = " + customer_phone, (error, payload) => {
        error ? response.err({ code: error.code }, res) :
        payload.length == 0 ? response.err({ message: "data not found" }, res) : 
        response.ok({ data: payload[0] }, res)
    });
};