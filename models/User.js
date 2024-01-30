const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = new mongoose.Schema({
  email: { type: String,  unique: true },
  password: { type: String, },
  UserName: String,
  registrationNumber: String,
  branch: String,
  phoneNumber: String,
  gender:String,
  // dateOfBirth: { type: String, },
  BoadingPoint: String,
  address: String,
  ParentPhoneNumber: String,
  year: String,
  chosse:String,    
  
  // attendance: [
  //   {
  //     date: { type: Date, default: moment().format('YYYY-MM-DD') },
  //     present: { type: Boolean },
  //   },
  // ],
  fromrequested:[
    {
      firstName: String,
      registrationNumber1: String,
      branch1: String,
      phoneNumber1: String,
      email1: String,
      BoardingPoint: String,
      date: { type: Date, default: moment().format('YYYY-MM-DD') },
     present: { type: Boolean },
     gender1:String,
     
    },
  ],
  Accepted:[
    {
      date: { type: Date, default: moment().format('YYYY-MM-DD') },
      Accept: { type: Boolean },
      message:String,
    },
  ],
  AdminbuspassAccepted:[
    {
      date: { type: Date, default: moment().format('YYYY-MM-DD') },
      BusAccept: { type: Boolean },
    
    },
  ],
  image: [
    {
      imageData: { type: mongoose.Schema.Types.ObjectId, ref: 'Image143' },
    },
  ],

});

const User = mongoose.model('UserTranspert', userSchema);

module.exports = User;
