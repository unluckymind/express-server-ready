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
    var total_point = 0;

    req.body.orders.map((order) => {
        if(order.customer_phone === order.customer_phone){
            // total += parseFloat(order.total_price)
            console.log("nomornya sama ", order.customer_phone)
        }
        connection.query("SELECT order_number FROM log_points WHERE order_number = "+ order.order_number, (err, result) => {
            result.map(number=>{

                // if(!number.order_number){
                //     // connection.query("INSERT INTO log_points (order_number, customer_phone, price_total) VALUES " + "(" +              order.order_number + "," + order.customer_phone + "," + order.price_total + ")", (error, payload) => {
                //     //     error ? response.err({ code: error.code }, res) : response.ok({ data: payload }, res)
                //     // })
                //     // connection.query(`UPDATE members SET point = '${sum_point}' where phone = '${order.customer_phone}'`, (er,rslt) => {
                //     //     er ? response.err({ code: er.code }, res) : response.ok({ data: rslt.affectedRows }, res)
                //     // });
                //     customer_phone = order.customer_phone;
                //     console.log("total price ", order.total_price)
                // }
            })
        });
        console.log("totalnya ", total)
    });
    // connection.query(`UPDATE members SET point = '${sum_point}' where phone = '${order.customer_phone}'`, (er,rslt) => {
    //     er ? response.err({ code: er.code }, res) : response.ok({ data: rslt.affectedRows }, res)
    // });
    // console.log("customer phone ", customer_phone)
    // console.log("ini adalah totalnya ", total)

    
}



