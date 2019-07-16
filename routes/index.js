"use strict";

module.exports = function (app) {
  const model = require("../model");
  const modelMember = require("../model/members");
  const modelToken = require("../model/webtoken")

  app.route("/v1/").get(model.index);
  app.route("/v1/members").get(modelMember.index);
  app.route("/v1/members").post(modelMember.add);
  app.route("/v1/members/login").post(modelMember.login);
  app.route("/v1/members/:id").get(modelMember.id);
  app.route("/v1/members/remove").delete(modelMember.remove);
  app.route("/v1/members/update").put(modelMember.update);

  app.route("/v1/token/test").get(modelToken.index);
};
