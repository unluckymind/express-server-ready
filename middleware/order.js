"use strict";

const response = require("../config/payload_config");
const connection = require("../config/connection");
const axios = require('axios')
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjozOTg0LCJ2ZW5kb3JfaWQiOjU3LCJ2ZW5kb3JfbmFtZSI6IlRva28gSGFuYSIsInZlbmRvcl9lbWFpbCI6InRva29oYW5hLmNvQGdtYWlsLmNvbSIsInJvbGUiOiJWRU5ET1IiLCJpYXQiOjE1NjAzMjYzNzUsImV4cCI6MTU5MTg2MjM3NX0.-kMayI3sKc_1lfJeWYka2jKp2QaiEWkO34yvHxfMvYWKmso3MKqaHzfUY093kFz_czocbxp5J8UFGHuRqo1gaA'

const Message = require("../helpers/messages");

exports.index = (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.halosis.app/v1/vendor/order?paid=1&per_page=99999999',
        headers: { 'token': token, 'x-localization': 'id' }
    }).then(result => {
        const array = result.data
        array.data.orders.map(get => {
            const data = {
                customer_id: get.customer.id,
                customer_phone: get.customer.phone,
                delivery_area: get.delivery_area,
                delivery_address: get.delivery_address,
                delivery_weight: get.delivery_weight,
                delivery_price: get.delivery_price,
                total_price: get.total_price,
                shipping_method: get.shipment_method,
                order_number: get.order_number,
                status: get.status,
                item_count: get.items_count,
                created_at: get.created_at.date
            }
            connection.query("INSERT INTO orders SET ?", [data], (error, payload) => {
                error ? console.log(Message.DATA_NOT_UPDATED) : console.log(Message.CRONJOB_SUCCESS, payload)
            })
        })
        response.ok({ data: { message: Message.CRONJOB_RUN } }, res)
    })
}
