"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const randtoken = require('rand-token');
const bcrypt = require('bcrypt');

exports.index = (req, res) => {
  connection.query("SELECT * FROM members", (error, payload) => {
    error ? response.err("unexpected request", error) : response.ok({ payload: payload }, res)
  });
};

exports.id = (req, res) => {
  const id = req.params.id
  connection.query("SELECT * FROM members where id = " + id, (error, payload) => {
    error ? response.err("unexpected request", error) : response.ok({ payload: payload }, res)
  });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  connection.query("SELECT password FROM members WHERE email = ?", email, (error, payload) => {
    error ? response.err("unexpected request", error) : payload.length > 0 ?
      bcrypt.compare(password, payload[0].password, (err, result) => {
        if (result == true) {
          connection.query("SELECT * FROM members WHERE email = ?", email, (error, payload) => {
            response.ok({ payload }, res)
          })
        } else {
          response.err({ error: "invalid data request" }, res)
        }
      }) : response.err({ error: "invalid data request" }, res)
  })
};

exports.add = (req, res) => {
  const generateCode = randtoken.generate(6)
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    let dataMember = {
      name: req.body.name,
      image: req.body.image,
      phone: req.body.phone,
      email: req.body.email,
      gender: req.body.gender || "",
      city: req.body.city || "",
      bod: req.body.bod || null,
      password: hash,
      code: generateCode,
      status: 1,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at
    }
    connection.query("INSERT INTO members SET ?", dataMember, (error, payload) => {
      error ? response.err({ error: error }, res) : (
        response.ok({ payload: { id: payload.insertId } }, res),
        req.body.code && req.body.code != "" ?
          connection.query("SELECT id FROM members where id = " + payload.insertId, (error, newPayload) => {
            let member_user_id = newPayload[0].id
            connection.query("SELECT id FROM members WHERE code = " + "'" + req.body.code + "'", (error, lastPayload) => {
              let member_id = lastPayload[0].id
              connection.query("INSERT INTO member_users (member_id, member_user_id) VALUES " + "(" + member_id + "," + member_user_id + ")", (err, refferal_registration) => {
                err ? response.err({ err }, res) : null
              });
            });
          }) : null
      )
    })
  });
};

exports.remove = (req, res) => {
  const id = req.body.id
  const removeUser = "DELETE FROM members where id = "
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
  connection.query("UPDATE members SET ? WHERE id=" + id, user, (err, payload) => {
    err ? response.err({ err }, res) : response.ok({ payload: { updated: payload } }, res)
  })
};