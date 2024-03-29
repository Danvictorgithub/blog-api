const express = require('express');
const router = express.Router();
const passport = require('passport');
const imageHandler = require('../configs/multer-config');
// Controllers
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

router.get("/", (req,res) => {
	res.json({message:"Blog-Api"});
});
//Authentication routes
router.get("/login",userController.login_GET);
router.post("/login",userController.login_POST);

router.get("/signup", userController.signup_GET);
router.post("/signup", userController.signup_POST);

router.get("/posts", postController.getAllPost);
router.get("/posts/random",postController.getRandomPost);
router.get("/posts/getUserPost", passport.authenticate('jwt',{session:false}),postController.getUserPost);
router.get("/posts/:postID",postController.getPost);
router.put("/posts/:postID",passport.authenticate('jwt',{session:false}),imageHandler.single('headlineImage'),postController.updatePost);
router.post("/posts/:postID/addComment",passport.authenticate('jwt',{session:false}),postController.addComment);
router.put("/posts/:postID/addLike",passport.authenticate('jwt',{session:false}),postController.addLike);
router.get("/posts/:postID/checkLike",passport.authenticate('jwt',{session:false}),postController.postCheckLike);
router.delete("/posts/:postID",passport.authenticate('jwt',{session:false}),postController.deletePost);
router.post("/posts/add",passport.authenticate('jwt',{session:false}),imageHandler.single('headlineImage'),postController.addPost);
router.post("/posts/imageHandler",imageHandler.single('img'),postController.postImageHandler);

// Authorization Testing
router.post("/protectedRoute",passport.authenticate('jwt',{session:false}),(req,res) => {
	res.status(200).json({message:"Authorization Successful"});
});
router.post("/adminDashboard",passport.authenticate('jwt',{session:false}),(req,res) => {
	res.status(200).json({message:"Authorization Successful"});
});
module.exports = router;
