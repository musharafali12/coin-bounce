let mongoose = require('mongoose');
let {MONGODB_CONNCEC_STRING} = require('../config/config');

let dbConnect = async () =>{
    try {
        let conn = await mongoose.connect(MONGODB_CONNCEC_STRING);
        console.log('Database connection successfully created');
    } catch (error) {
        console.log(`Database connection error ${error}`)
    }
}

module.exports = dbConnect;