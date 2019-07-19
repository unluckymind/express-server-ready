"use strict";

exports.ok = function (values, res) {
  var data = {
    statusCode: res.statusCode,
    values: values
  };
  res.json(data);
  res.end();
};

exports.err = function (values, res) {
  var data = {
    statusCode: values.error.status,
    error: { message: values.error.message }
  };
  res.json(data);
  res.end();
};
