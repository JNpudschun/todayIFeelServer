const mongoose = require("mongoose")
// const bcrypt = require("bcrypt")
// const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    }
}, 
{ timestamps: true }
)

// Encryption of user password to save it into database
// UserSchema.pre("save", function(next)) {
//     let user = this;
        // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();

//   // generate a salt
//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//       if (err) return next(err);

//       // hash the password using our new salt
//       bcrypt.hash(user.password, salt, function(err, hash) {
//           if (err) return next(err);
//           // override the cleartext password with the hashed one
//           user.password = hash;
//           next();
//       });
//   });

// }

// Authentication
// UserSchema.statics.authenticate = function (email, password, callback) {
//     User.findOne({ email: email }).exec(function (err, user) {
//       if (err) {
//         return callback(err);
//       } else if (!user) {
//         var err = new Error("User not found.");
//         err.status = 401;
//         return callback(err);
//       }
//       bcrypt.compare(password, user.password, function (err, result) {
//         if (err) {
//           return callback(err);
//         }
//         if (result === true) {
//           return callback(null, user);
//         } else {
//           var err = new Error("Incorrect password.");
//           err.status = 402;
//           return callback(err);
//         }
//       });
//     });
//   };


const User = mongoose.model("User", UserSchema)

module.exports = User