"use strict";

module.exports = function (app) {
  const model = require("../model");
  const modelMember = require("../model/members");
  const modelToken = require("../model/webtoken")

  app.route("/v1/").get(model.index);
  app.route("/v1/members").get(modelMember.index);
  app.route("/v1/members/:id").get(modelMember.id);
  app.route("/v1/members").post(modelMember.register);
  app.route("/v1/members/dashboard").post(modelMember.login);

  app.route("/v1/tokens/apikey").get(modelToken.apikey);
  app.route("/v1/tokens/test").get(modelToken.index);
};
