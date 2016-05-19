var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', users);

module.exports = User;