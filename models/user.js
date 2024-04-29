//models\user.js
const mongoose = require("mongoose");
const Doacao = require("./doacao");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
},
  points:{
    type: Number, 
    required: true,
    default: 0 
  },
  role: {
     type: String,
      enum: ['Admin', 'Funcionario', 'Doador'], default: 'Doador' },

});

module.exports = mongoose.model("User", userSchema);
