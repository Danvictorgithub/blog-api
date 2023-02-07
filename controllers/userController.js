const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
exports.login_GET = (req,res) => {
	res.json({message:"Not Yet Implemented"});
};
exports.login_POST = (req,res) => {
	res.json({message:"Not Yet Implemented"});
};
exports.signup_GET = (req,res) => {
	res.json({message:"Not Yet Implemented"});
};
exports.signup_POST = [
	check('username').trim().isLength({min:8}).withMessage("Username must be more than or equal 8 characters").isLength({max:16}).withMessage("Username must be less than 16 characters").escape(),
	check('password').isAlphanumeric().withMessage("Password must be Alphanumeric").isLength({min:8}).withMessage("Password must be atleast 8 characters").isLength({max:128}).withMessage("Password exceeds 128 character limit").escape(),
	(req,res,next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(400).json({errors:errors.array()});
			return;
		}
		User.findOne({username:req.body.username}).exec((err,result)=> {
			if (err) {
				return next(err);
			}
			if (result == null) {
				bcrypt.hash(req.body.password,12,(err,hashedPassword) => {
					if (err) {
						return next(err);
					}
					const newUser = new User({
						username:req.body.username,
						password:hashedPassword
					});
					newUser.save((err)=> {
						if (err) {
							return next(err);
						}
						res.status(201).json({
							statusCode:201,
							message:"User successfully created"
						});
					});
				});
			} else {
				res.status(400).json({
					statusCode:400,
					message:"Username Already Exist",
				});
			}
		});
	}	
];