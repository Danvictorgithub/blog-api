const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username:{type:String,required:true,minLength:8,maxLength:64},
	passowrd:{type:String,required:true,minLength:8,maxLength:64},
	isAdmin:{type:Boolean,required:true,default:false},
});

module.exports = mongoose.model('User',userSchema);