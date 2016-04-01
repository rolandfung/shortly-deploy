var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

//Define schema with props and methods
var usersSchema = mongoose.Schema({
  username: String,
  password: String,

});

usersSchema.method('comparePassword', function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
});

var User = mongoose.model('User', usersSchema);


module.exports = User;