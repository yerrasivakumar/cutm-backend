const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
  });
  
  // Hash password before saving to the database
  // userSchema.pre('save', async function (next) {
  //   try {
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(this.password, salt);
  //     this.password = hashedPassword;
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  const Admin = mongoose.model('Admins', userSchema);

  module.exports = Admin;  