"use strict";
const Messages = {
    INVALID_REQ: "invalid data request",

    MEMBER_EXIST: "member is already exist",
    MEMBER_NOT_EXIST: "member is not exist",

    EMAIL_EXIST: "email has already exist",
    EMAIL_NOT_EXIST: "email is not exist",

    UPLOAD_SUCCESS: "attachment uploaded success",
    UPLOAD_FAILED: "attachment is not uploaded",

    CRONJOB_RUN: "cron job is running...",
    CRONJOB_SUCCESS: "cron job succeed",
    CRONJOB_FAILED: "cron job failed",

    INVALID_REFERRAL_CODE: "referrals code not found",
    DATA_NOT_UPDATED: "uppsss! something went wrong. database not updated",

    UPLOAD_LARGER: "image too large",
    UPLOAD_NO_IMAGE: "no image attached or image too large",

    DB_CONNECT: "database connected, current env is on",

    DEV_SERVER: "express DEVELOPMENT RESTful API starting on",
    PROD_SERVER: "express PRODUCTION RESTful API starting on"
}

module.exports = Messages;