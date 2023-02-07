const express = require('express');
const router = express.Router();

// Controllers
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

router.get("/", (req,res) => {
	res.json({message:"Blog-Api"});
});
router.get("/login",userController.login_GET);
router.post("/login",userController.login_POST);

router.get("/signup", userController.signup_GET);
router.post("/signup", userController.signup_POST);

router.get("/posts", postController.getAllPost);
router.get("/posts/add", postController.addPost);

module.exports = router;