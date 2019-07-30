"use strict";

module.exports = function (app) {
  const model = require("../model");
  const modelMember = require("../model/members");
  const modelToken = require("../model/webtoken");
  const modelProduct = require("../model/products");
  const modelPoint = require("../model/point");
  const modelCms = require("../model/cms")
  const middleWareOrder = require("../middleware/order")

  app.route("/").get(model.main);
  app.route("/v1").get(model.index);

  // API MEMBER - USER
  app.route("/v1/members").get(modelMember.index);
  app.route("/v1/members/:id").get(modelMember.id);
  app.route("/v1/members/:id/user").get(modelMember.userList);

  app.route("/v1/members").post(modelMember.register);
  app.route("/v1/members/dashboard").post(modelMember.login);

  app.route("/v1/members").put(modelMember.update);
  app.route("/v1/members/password").put(modelMember.updatePassword);
  app.route("/v1/members/image").put(modelMember.updateImage);

  // API PRODUCT LOG (SHARES LOG)
  app.route("/v1/products/log").get(modelProduct.index);
  app.route("/v1/products/log/:member_id").get(modelProduct.member_id);
  app.route("/v1/products/log").post(modelProduct.save);

  //API LOG POINT
  app.route("/v1/points").post(modelPoint.save);
  app.route("/v1/points/:phone_number").get(modelPoint.phone_number);

  // API CMS
  app.route("/v1/cms/banners").get(modelCms.index);
  app.route("/v1/cms/banners/:id").get(modelCms.id);
  app.route("/v1/cms/banners").post(modelCms.save);
  app.route("/v1/cms/banners").delete(modelCms.remove);
  app.route("/v1/cms/banners").put(modelCms.update);

  app.route("/v1/orders/history").get(middleWareOrder.index);

  // API TOKEN AUTHORIZATION
  app.route("/v1/tokens/apikey").get(modelToken.apikey);
}
