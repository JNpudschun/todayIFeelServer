const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require("bcrypt")
const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Please enter an E-Mail"],
        unique: true,
        lowercase: true,
        validate : [isEmail,"Please enter a valid E-Mail"]
    },
    password:{
        type: String,
        required: [true,"Please enter a Password"],
        minlength: [8,"Password must be min 8 Characters"],
        maxlength: [20,"Password must be max 20 Characters"]
    }
}
)

// Encryption of user password to save it into database
UserSchema.pre("save", function(next) {
    let user = this;
        // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });

},

// Authentication
UserSchema.statics.authenticate = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
});


const User = mongoose.model("User", UserSchema)

module.exports = User