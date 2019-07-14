"use strict";

module.exports = function(app) {
  var getData = require("../model/index");

  app.route("/").get(getData.index);
  app.route("/users").get(getData.users);
};
