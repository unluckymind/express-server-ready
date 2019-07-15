const jwt = require('jsonwebtoken');

module.exports = {
    sign: (payload, privateKEY, signOptions) => {
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verify: (token, publicKEY, verifyOptions) => {
        try {
            return jwt.verify(token, publicKEY, verifyOptions)
            // , (err, decoded) => {
            //     err ? console.log(err) : console.log(decoded)
            // });
        } catch (err) {
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, { complete: true });
    }
}