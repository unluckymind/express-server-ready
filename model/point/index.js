"use strict";

const response = require("../../config/payload_config");
const connection = require("../../config/connection");

exports.phone_number = (req, res) => {
    const phone_number = req.params.phone_number
    connection.query("SELECT order_number FROM log_points WHERE customer_phone = "+ phone_number, (err, result) => {
        err ? response.err({ code: err.code }, res) : response.ok({ data: result }, res)
    });
}

exports.save = (req, res) => {
    var total = 0;
    var phone = "";
    req.body.orders.map(order => {
       phone = order.customer_phone
        connection.query('INSERT INTO log_points (order_number, customer_phone, price_total) VALUES ' + '(' +              
        "'"+order.order_number +"'"+ ',' + "'" + order.customer_phone + "'" + ',' + order.price_total + ')', (error, payload) => {    
            
        })  
    });
    total = req.body.grand_total / 100000;
    connection.query("SELECT point FROM members WHERE phone = "+ phone, (err, point) => {
        var sum_point = point[0].point + Math.trunc(total);
        connection.query(`UPDATE members SET point = '${sum_point}' where phone = '${phone}'`, (er,rslt) => {
            er ? response.err({ code: er.code }, res) : response.ok({ data: rslt.affectedRows }, res)
        });
    });
    
        
}



