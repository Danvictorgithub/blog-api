const User = require('../models/user');
const {body, validationResult} = require('express-validator');
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
	body('username').trim().isLength({min:8}).withMessage("Username must be more than or equal 8 characters").isLength({max:16}).withMessage("Username must be less than 16 characters").escape(),
	body('password').trim().isLength({min:8}).withMessage("Password must be atleast 8 characters").isLength({max:128}).withMessage("Password exceeds 128 character limit").escape(),
	(req,res,next) => {
		console.log(req.body);
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.json({message:errors.array()});
			return;
		}
		res.json({message:"Success!"});
	}	
];