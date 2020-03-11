// const jwt = require('express-jwt');
// const secret = process.env.TOKEN_EXPIRE || "secret";

// function getTokenFromHeader(req){
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
//       req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     return req.headers.authorization.split(' ')[1];
//   }

//   return null;
// }

// const auth = {
//   required: jwt({
//     secret: secret,
//     userProperty: 'payload',
//     getToken: getTokenFromHeader
//   }),
//   optional: jwt({
//     secret: secret,
//     userProperty: 'payload',
//     credentialsRequired: false,
//     getToken: getTokenFromHeader
//   })
// };

// module.exports = auth;

const jwt = require("express-jwt");
var jsonwebtoken = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret";

// function getTokenFromHeader(req) {
//     if (
//         (req.headers.authorization &&
//             req.headers.authorization.split(" ")[0] === "Token") ||
//         (req.headers.authorization &&
//             req.headers.authorization.split(" ")[0] === "Bearer")
//     ) {
//         return req.headers.authorization.split(" ")[1];
//     }

//     return null;
// }

// const auth = {
//     required: jwt({
//         secret: secret,
//         userProperty: "payload",
//         getToken: getTokenFromHeader
//     }),
//     optional: jwt({
//         secret: secret,
//         userProperty: "payload",
//         credentialsRequired: false,
//         getToken: getTokenFromHeader
//     })
// };

// module.exports = auth;
module.exports = jwt({ secret });

module.exports.getJWTData = req => {
    let decoded = {};
    try {
        const authorization = req.headers.authorization.split(" ")[1];
        decoded = jsonwebtoken.verify(authorization, secret);
    } catch (e) {
        console.log(e);
    }
    return decoded;
};
