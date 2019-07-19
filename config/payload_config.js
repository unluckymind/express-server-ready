"use strict";

exports.ok = function (datas, res) {
  var data = {
    statusCode: res.statusCode,
    payload: datas
  };
  res.json(data);
  res.end();
};

exports.err = function (error, res) {
  var data = {
    statusCode: res.statusCode,
    error: error
  };
  res.json(data);
  res.end();
};

exports.errAuthorize = function (values, res) {
  var data = {
    statusCode: values.error.status,
    error: { message: values.error.message }
  };
  res.json(data);
  res.end();
};
