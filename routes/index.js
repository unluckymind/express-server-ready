"use strict";

module.exports = function (app) {
  const model = require("../model/index");
  const modelUser = require("../model/users/index");
  const modelToken = require("../model/webtoken/index")

  app.route("/v1/").get(model.index);
  app.route("/v1/users").get(modelUser.index);
  app.route("/v1/users/add").post(modelUser.add);
  app.route("/v1/users/remove").delete(modelUser.remove);
  app.route("/v1/users/update").put(modelUser.update);



  app.route("/v1/test").get(modelToken.index);
};
