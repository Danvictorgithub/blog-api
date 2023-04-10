const {getStorage,ref, uploadBytes,getDownloadURL} = require("firebase/storage");
const Post = require('../models/post');
const jwt = require("jsonwebtoken");
const {body,validationResult} = require("express-validator");
require('dotenv').config();

//Helper Functions
function getCurrentDateTime() {
	//randomizer for filename
	const now = new Date();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const year = now.getFullYear().toString().substr(-2);
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const seconds = now.getSeconds().toString().padStart(2, '0');
	const dateTime = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${year}${hours}${minutes}${seconds}`;
	return dateTime;
}
function fileNameFixer(filename) {
	//generates unique filename
	return `${getCurrentDateTime()}_${filename}`;
}
function imageReferenceGenerator(fileDirectory,file) {
	const firebaseDir = fileDirectory;
	const imageFileName = file.originalname;
	const uniqueImageFileName = fileNameFixer(imageFileName); 
	const imageReference = firebaseDir+uniqueImageFileName;
	return imageReference;
}
async function uploadImage(imageReference,file) {
	const storage = getStorage();
	const imageRef = ref(storage, imageReference);
	const metadata = {contentType:file.mimetype};
	const snapshot = await uploadBytes(imageRef,file.buffer,metadata);
	const downloadURL = await getDownloadURL(ref(storage,snapshot.metadata.fullPath));
	return downloadURL;
}

exports.getAllPost = (req,res) => {
	res.json({message:"Not yet Implemented"});
};
exports.addDummyPost = (req,res) => {
	res.json({message:"Not yet Implemented"});
};
exports.addPost = [
	// validates inputs
	body('title')
		.trim()
		.isLength({min:8})
		.withMessage("The title must be atleast 8 characters")
		.isLength({max:32})
		.withMessage("The title must not exceed by 32 characters"),
	body('content')
		.trim()
		.isLength({min:32})
		.withMessage("The content is below minimum requirements")
		.isLength({max:2000})
		.withMessage("The content is above maximum requirements"),
	(req,res) => {
		//checks if there is inputs anomaly else continue verify token
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({message:"Invalid requirements",errors:errors.array()});
		}
		if (req.file === undefined) {
			return res.status(400).json({message:"No File Extenstion"});
		}
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token,process.env.SECRET_KEY,async function(err,decoded) {
		if (err) {
			return res.status(401).json({message:"Invalid JWT"}); //added redundancy for security
		}
		else {
			// confirms JWT and uses user id as "author"
			// uploads image to firebase storage and assigns it as headlineImage URL
			const imageReference = imageReferenceGenerator('BlogProject/images/',req.file);
			const downloadURL = await uploadImage(imageReference,req.file);
			// console.log(decoded.user._id);
			const newPost = new Post({
				author:decoded.user._id,
				title:req.body.title,
				content:req.body.content,
				headlineImage:downloadURL
			});
			newPost
				.save()
				.then((result)=> {
					console.log(`New Post Added: ${result.title}`);
					return res.status(200).json({message:"Success"});
				})
				.catch((err)=> {
					console.log(err);
					return res.status(400).json({message:"Unexpected Error"});
			})
		}
	})
	}
];
exports.postImageHandler = async (req,res) => {
	// returns imgURL
	// this function is for custom TinyMCE filepicker auto upload image
	if (req.file === undefined) {
		return res.status(400).json({message:"No File Extenstion"});
	}
	const imageReference = imageReferenceGenerator('BlogProject/images/',req.file);
	const downloadURL = await uploadImage(imageReference,req.file);
	return res.status(200).json({message:"success",img:downloadURL});
}