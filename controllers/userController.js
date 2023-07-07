const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// User Authentication
exports.login_GET = (req,res,next) => {
	res.json({message:"Not Yet Implemented"});
};

exports.login_POST = (req,res,next) => {
	// console.log(req.body);
	// passport.authenticate('local',{session:false},(err,user,info) =>{authentication})(req,res) //It is an object constructor with double return values
	// authentication -> - error or user doesn't exist returns statusCode 400 (Bad Request)
	//					 - success then login user with JWT token used for user authentication to protected routes

	passport.authenticate('local',{session:false},(err,user,info) => {

		// session is set to false since API is used for authentication

		if (err || !user) {
			return res.status(400).json({
				message: "Invalid Password",
				user: user
			});
		}
		req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
			jwt.sign({user}, process.env.SECRET_KEY,(err,token)=>{
				if (err) {
					return res.status(400).json({
						message: "Something is not right",
					});
				}
				return res.status(200).json({user, token});
			});
		   });
	})(req,res);
};
exports.signup_GET = (req,res) => {
	res.json({message:"Not Yet Implemented"});
};
exports.signup_POST = [

	// check('params').sanitationRules({params:paramsValue}) Sanitizes req.body.<formData>

	check('username').trim().isLength({min:8}).withMessage("Username must be more than or equal 8 characters").isLength({max:16}).withMessage("Username must be less than 16 characters").escape(),
	check('password').isAlphanumeric().withMessage("Password must be Alphanumeric").isLength({min:8}).withMessage("Password must be atleast 8 characters").isLength({max:128}).withMessage("Password exceeds 128 character limit").escape(),
	(req,res,next) => {
		// Returns Error if request.body failed Sanitation process
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.status(400).json({errors:errors.array()});
			return;
		}
		User.findOne({username:req.body.username}).exec((err,result)=> {
			if (err) {
				return next(err);
			}

			// Checks if user already exist in the database, otherwise create new User with hashed password

			if (result == null) {
				bcrypt.hash(req.body.password,12,(err,hashedPassword) => {
					if (err) {
						return res.status(400).json({message:"Something is not right"});
					}
					const newUser = new User({
						username:req.body.username,
						password:hashedPassword
					});
					newUser.save((err)=> {
						if (err) {
							return next(err);
						}
						return res.status(201).json({
							statusCode:201,
							message:"User successfully created"
						});
					});
				});
			} else {
				return res.status(400).json({
					statusCode:400,
					message:"Username Already Exist",
				});
			}
		});
	}
];
