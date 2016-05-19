var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var users = new Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', users);

users.pre('save', function(next) {
  bcrypt.hash(this.password, null, null, function(err, hash) {
    this.password = hash;
    next(); 
  }.bind(this));
});
// var comparePassword = function(attemptedPassword, callback) {
//   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//     callback(isMatch);
//   });
// },
// hashPassword: function() {
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.get('password'), null, null).bind(this)
//     .then(function(hash) {
//       this.set('password', hash);
//     });
// }
module.exports = User;