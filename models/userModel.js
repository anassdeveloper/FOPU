const mongoose = require('mongoose');
const validator = require('validator');
const hashPass = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
   name: String,
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      unique: true,
      dropDups: true,
      lowercase: true,
      validate: [validator.isEmail]
   },
   photo: {
    type: String,
    default: 'default.jpg'
   },
   role: {
      type: String,
      enum: ['admin', 'guide', 'guide-lead', 'user'],
      default: 'user'

   },
   password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
   },
   passwordConfirm: {
      type: String,
      required: true,
      validate: {
         //THIS WORK AT CREATION AND USE METHOD SAVE Not work at update
         validator: function(el){
            return el === this.password;
         },
         message: 'Password are not a same'
      }
   },
   passwordResetToken: String,
   passwordResetExpires: Date,
   bio: {
      type: String,
      default: 'We peaple of FOPU 💥'
   },
   posts: Array
});

// Db bghina nchafro password a7ssan blassa hiya Model o mankhdmoch f controllers
// 7it model hiya i 3andha 3ala9a b database mobachira

//bach nchafro password 9balma nsjloh fi database kansta3mlo mongoose middelware
// had function ghadi t5dem f la7da bin istilam data o atna2 save method

userSchema.pre('save', async function(next){
   if(!this.isModified('password')) return next();
   this.password = await hashPass.hash(this.password, 12);
   this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(condidatePassword, userPassword){
   return await hashPass.compare(condidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTimestamp){
   if(this.passwordChangeAt){
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTimestamp < changedTimestamp;
   }
   return false;
}
userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log('GENERATE TOKEN /', resetToken)
  this.passwordResetToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');
  console.log('HIDE TOKEN / ', this.passwordResetToken);
  // date db + 10min 7AWLNAHA L MS 10min 60s 1000ms
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}
const userModel = mongoose.model('User', userSchema);


module.exports = userModel;
