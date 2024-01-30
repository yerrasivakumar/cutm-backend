const mongoose = require('mongoose');
const moment = require('moment');
const responseSchema = new mongoose.Schema({
    Username: String,
    Branch:String,
    FeedBack:String,
    createdAt: { type: String, default: moment().format('DD/MM/YYYY') }
});
const Response = mongoose.model('FeedBack', responseSchema);
module.exports = Response;