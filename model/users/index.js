"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");

exports.index = (req, res) => {
  connection.query("SELECT * FROM users", (error, payload) => {
    error ? response.err("unexpected request", error) : response.ok({ payload: payload }, res)
  });
};

exports.add = (req, res) => {
  const user = {
    id: req.body.id,
    email: req.body.email,
    password: req.body.password
  }
  const userDetail = {
    id: req.body.id || '',
    name: req.body.name || '',
    email: req.body.email || '',
    whatsapp_number: req.body.whatsapp_number || 0,
    instagram_account: req.body.instagram_account || '',
    transaction_each_month: req.body.transaction_each_month || 0
  }

  const insertNewUser = "INSERT INTO users SET ?"
  const insertNewUserDetail = "INSERT INTO detailusers SET ?"

  const initialize = connection.query(insertNewUser, user)
  initialize ? connection.query(insertNewUserDetail, userDetail, (error, payload) => {
    response.ok({ payload: { add: true } }, res)
  }) : response.err("invalid data format")
};

exports.remove = (req, res) => {
  const id = req.body.id
  const removeUser = "DELETE FROM users where id = "
  const removeDetailUser = "DELETE FROM detailusers where id = "

  const initialize = connection.query(removeUser + id)
  initialize ? connection.query(removeDetailUser + id, (error, payload) => {
    error ? response.err("unexpected request", error) : response.ok({ payload: { removed: true } }, res)
  }) : response.err("invalid data format")
};

exports.update = (req, res) => {
  const id = req.body.id
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  connection.query("UPDATE users SET ? WHERE id=" + id, user, (err, payload) => {
    err ? response.err({ err }, res) : response.ok({ payload: { updated: payload } }, res)
  })
};