const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//users Schema
const UserSchema = new Schema({
   name: String,
   email: String,
   password:String
});

module.exports = mongoose.model('users', UserSchema);