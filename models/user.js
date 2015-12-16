//Require Moongoose/Bcrypt
var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

// Set a function to return all lowercase
function toLower (v) {
  return v.toLowerCase();
}

//User Schema
var UserSchema = new Schema({
    created_at: { type: Date }, 
    updated_at: { type: Date }, 
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    displayName: String,
    picture: String,
    facebook: String
});

//Virtual method for fullname
UserSchema.virtual('fullname').get(function() {
  return this.first + ' ' + this.last;
});


//Before saving user
UserSchema.pre('save', function(next){
  // Set Created At and Updated At
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }

  // Encrypt Password
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

//compare password method
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;