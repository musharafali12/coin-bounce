let mongoose = require('mongoose');

let tokenSchema = new mongoose.Schema({
    userId:{type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    token:{type: String, required: true}
},

    {timestamps:true}

);

let Token = mongoose.model('tokens', tokenSchema);

module.exports = Token;