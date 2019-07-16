"use strict";

module.exports = function (app) {
  const model = require("../model");
  const modelUser = require("../model/users");
  const modelToken = require("../model/webtoken")

  app.route("/v1/").get(model.index);
  app.route("/v1/members").get(modelUser.index);
  app.route("/v1/members").post(modelUser.add);
  app.route("/v1/members/login").post(modelUser.login);

  app.route("/v1/members/remove").delete(modelUser.remove);
  app.route("/v1/members/update").put(modelUser.update);

  app.route("/v1/token/test").get(modelToken.index);
};
