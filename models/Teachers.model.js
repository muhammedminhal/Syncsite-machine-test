const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, 
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

//this is to validate email to be uniue
TeacherSchema.plugin(uniqueValidator);

//this function will be called before a document is saved
TeacherSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) {
    return next();
  }

 // hashing the password 12 rounds
  bcrypt
    .genSalt(12)
    .then((salt) => {
      return bcrypt.hash(user.password, salt);
    })
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

module.exports = mongoose.model('Teacher', TeacherSchema);