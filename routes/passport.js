const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// PassportJS Setup
passport.use(new LocalStrategy((username,password,cb)=> {
	User.findOne({username:username}).exec((err,user)=>{
		if (err) {
			return cb(err);
		}
		if (!user) {
			return cb(null,false,{message:"Incorrect Username"});
		}
		bcrypt.compare(password,user.password,(err,res) => {
			if (err) {
				return cb(err);
			}
			if (res) {
				return cb(null,user,{message:"Logged In Successfuly"});
			}
			else {
				return cb(null,false,{message:"Incorrect Password"});
			}
 		});
	});
}));