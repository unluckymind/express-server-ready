"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const randtoken = require('rand-token');
const bcrypt = require('bcrypt');


exports.index = (req, res) => {
  connection.query("SELECT * FROM members", (error, payload) => {
    error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
  });
};

exports.id = (req, res) => {
  const id = req.params.id
  connection.query("SELECT * FROM members where id = " + id, (error, payload) => {
    error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
  });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    response.err({
      message: "invalid data request"
    }, res)
  } else {
    connection.query("SELECT password FROM members WHERE email = ?", email, (error, payload) => {
      error ? response.err({ code: error.code }, error) : payload.length > 0 ?
        bcrypt.compare(password, payload[0].password, (err, result) => {
          if (result == true) {
            connection.query("SELECT * FROM members WHERE email = ?", email, (error, payload) => {
              error ? response.err({ code: error.code }, error) : response.ok({ data: payload }, res)
            })
          } else {
            response.err({ message: "invalid data request" }, res)
          }
        }) : response.err({ message: "invalid data request" }, res)
    })
  }
};

exports.register = (req, res) => {
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
    if (req.body.code && req.body.password && req.body.email) {
      let users = ''
      let id = ''
      connection.query("SELECT id FROM members WHERE code = " + "'" + req.body.code + "'", (error, userData) => {
        if (error) {
          response.err({ code: error.code }, res)
        }
        connection.query("SELECT COUNT(*) as emailExist FROM members WHERE email = " + "'" + req.body.email + "'", (error, validation) => {
          if (validation[0].emailExist > 0) {
            response.err({ message: "email already exist" }, res)
          } else {
            if (userData[0]) {
              users = userData[0].id
              connection.query("INSERT INTO members SET ?", dataMember, (error, memberData) => {
                if (error) {
                  response.err({ code: error.code }, res)
                }
                id = memberData.insertId
                connection.query("INSERT INTO member_users (member_id, member_user_id) VALUES " + "(" + id + "," + users + ")", (error, payload) => {
                  error ? response.err({ code: error.code }, res) : response.ok({ data: { id: payload.insertId } }, res)
                })
              })
            } else {
              response.err({ message: "code tidak ditemukan" }, res)
            }
          }
        })
      });

    } else {
      connection.query("SELECT COUNT(*) as emailExist FROM members WHERE email = " + "'" + req.body.email + "'", (error, validation) => {
        if (validation[0].emailExist > 0) {
          response.err({ message: "email already exist" }, res)
        } else {
          connection.query("INSERT INTO members SET ?", dataMember, (error, payload) => {
            error ? response.err({ code: error.code }, res) : response.ok({ data: { id: payload.insertId } }, res)
          });
        }
      })
    }
  });
};