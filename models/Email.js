const mongoose = require('mongoose');
const moment = require('moment');
const responseSchema = new mongoose.Schema({
    Name: String,
    Gmail:String,
    Message:String,
    createdAt: { type: String, default: moment().format('DD/MM/YYYY') }
});
const Response = mongoose.model('ContactFrom', responseSchema);
module.exports = Response;