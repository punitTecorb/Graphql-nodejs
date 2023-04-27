const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const providerSchema = new Schema({

   name: String,
   email:String,
   desc: String,
   service: String
});

module.exports = mongoose.model('providers', providerSchema);
