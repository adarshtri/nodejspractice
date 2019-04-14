let mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_logged_in: {
    type:  Boolean,
    required: false
  },
  is_admin: {
    type: Boolean,
    required: false
  },
  active: {
    type: Boolean,
    required: false,
    default: false
  }
},{collection: 'user'});

// creating schema methods
userSchema.methods.isLoggedIn = function(){
  return this.is_logged_in;
};

// export user model
var userModel = module.exports = mongoose.model('user', userSchema);

module.exports.getUser = function(callback,limit){
  userModel.find(callback).limit(limit);
};
