const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    username: String,
    email: String,
    password: String,
    profpic: String
});

const User = mongoose.model('User', UserSchema);

exports.create = function(obj, next) {
    const user = new User(obj);
  
    user.save(function(err, user) {
      next(err, user);
    });
  };
  
  exports.findMany = function(query, next) {
    User.find(query).lean().exec(function(err, user) {
      next(err, user);
    });
  };
  
  exports.getOne = function(query, next) {
    User.findOne(query, function(err, user) {
      next(err, user);
    });
  };

  exports.get1 = function(query, next) {
    User.findOne(query).lean().exec(function(err, user) {
      next(err, user);
    });
  };

  exports.updateOne = function(query, update, next) {
    User.updateOne(query, update, function(err, user) {
      next(err, user);
    });
  };

  exports.deleteOne = function(query, next) {
    User.deleteOne(query, function(err, user) {
      next(err, user);
    });
  };