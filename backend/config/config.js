let dotenv = require('dotenv').config();

let MONGODB_CONNCEC_STRING = process.env.MONGODB_CONNCEC_STRING;
let PORT = process.env.PORT;
let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
let REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


module.exports = {
    MONGODB_CONNCEC_STRING,
    PORT,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
};