const express = require('express');
const router = express.Router();


router.get("/", (req,res) => {
	res.json({message:"Blog-Api"});
});
router.get("/login",(req,res)=> {
	res.json({message:"Login Not Yet Implemented"});
});
router.get("/signup",(req,res)=>{
	res.json({message:"Sign-Up Not Yet Implemented"});
});
router.get("/posts",(req,res)=> {
	res.json({message:"GET POST Not yet Implemented"});
});

module.exports = router;