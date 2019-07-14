"use strict";

var response = require("../standarized");
var connection = require("../config/connection");

exports.index = function(req, res) {
  response.ok("connection success", res);
};

exports.users = function(req, res) {
  connection.query("SELECT * FROM person", function(error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      response.ok(rows, res);
    }
  });
};
