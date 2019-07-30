"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");
const db = require("../../helpers/query");

exports.phone_number = (req, res) => {
    const phone_number = req.params.phone_number
    connection.query(db.SAHABAT().log_points.getOrderNumberByPhone + phone_number, (err, result) => {
        err ? response.err({ code: err.code }, res) : response.ok({ data: result }, res)
    });
}

exports.save = (req, res) => {
    var total = 0;
    var phone = "";
    req.body.orders.map(order => {
        phone = order.customer_phone;
        connection.query(db.SAHABAT().log_points.insert + '(' +              
        "'"+order.order_number +"'"+ ',' + "'" + order.customer_phone + "'" + ',' + order.price_total + ')', (error, payload) => {    

        })  
    });
    total = req.body.grand_total / 1000;
    connection.query(db.SAHABAT().log_points.getPointsByPhone + phone, (err, point) => {
        var sum_point = point[0].point + Math.trunc(total);
        let data = {
            point : sum_point
        }
        connection.query(db.SAHABAT(phone).log_points.updatePoints, data, (er,rslt) => {
            er ? response.err({ code: er.code }, res) : response.ok({ data: rslt.affectedRows }, res)
        });
    });
    
        
}



