const {getStorage,ref, uploadBytes,getDownloadURL} = require("firebase/storage");
const cheerio = require("cheerio");
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const jwt = require("jsonwebtoken");
const {body,validationResult} = require("express-validator");

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);
const IndexPostLimit = 30;
require('dotenv').config();

//Helper Functions
function TinyMCEValidator(value) {
	return dompurify.sanitize(value);
}
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
	//Generates a Filename for the image Reference
	const firebaseDir = fileDirectory;
	const imageFileName = file.originalname;
	const uniqueImageFileName = fileNameFixer(imageFileName);
	const imageReference = firebaseDir+uniqueImageFileName;
	return imageReference;
}
async function uploadImage(imageReference,file) {
	// Helper function for uploading Image from Firebase
	const storage = getStorage();
	const imageRef = ref(storage, imageReference);
	const metadata = {contentType:file.mimetype};
	const snapshot = await uploadBytes(imageRef,file.buffer,metadata);
	const downloadURL = await getDownloadURL(ref(storage,snapshot.metadata.fullPath));
	return downloadURL;
}
exports.getAllPost = async (req,res) => {
	try {
		const PostsList = await Post.find({}).populate("author","username").select(["headlineImage","author","title","content","date"]);
		PostsList.forEach((post) => {
			const $ = cheerio.load(post.content);
			const postText = $.text().replace(/\n/g, '');
			const words = postText.split(" ");
			if (words.length < 25) {
				post.content = words.splice(0,IndexPostLimit).join(" ");
			}
			else {
				post.content = words.splice(0,IndexPostLimit).join(" ")+"...";
			}
		});
		return res.status(200).json({message:"Success",posts:PostsList});
	}
	catch(e) {
		return res.status(400).json({message:"Couldn't reach DB",error:e});
	}
};
exports.getPost = async (req,res) => {
	try {
		const PostObj = await Post.findById(req.params.postID)
			.populate("author","username")
			.populate({path:"comments",populate:{path:"user",select:"username"}})
		if (PostObj === null) {
			return res.status(400).json({message:"Post ID doesn't exist"});
		}
		return res.status(200).json({message:"Success",post:PostObj});
	}
	catch(e) {
		return res.status(400).json({message:"Couldn't reach DB",error:e});
	}
};
exports.updatePost = [
	async (req,res,next) => { //checks if post exist
		try {
			const PostObj = await Post.findById(req.params.postID);
			if (PostObj === null) {
				return res.status(400).json({message:"Post ID doesn't exist"});
			}
			// return res.status(200).json({message:"Success",post:PostObj});
			next();
		}
		catch(e) {
			return res.status(400).json({message:"Couldn't reach DB",error:e});
		}
		// return res.status(200).json({message:"updatePost is not yet Implemented"});
	},
	body('title')
		.trim()
		.isLength({min:8})
		.withMessage("The title must be atleast 8 characters")
		.isLength({max:64})
		.withMessage("The title must not exceed by 32 characters"),
	body('content')
		.trim()
		.customSanitizer(TinyMCEValidator)
		.isLength({min:32})
		.withMessage("The content is below minimum requirements")
		.isLength({max:10000})
		.withMessage("The content is above maximum requirements"),
	(req,res) => {
		//checks if there is inputs anomaly else continue verify token
		console.log(req.body.params);
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
			try {
				Post.updateOne(
				{_id:req.params.postID},
				{$set:{
					title:req.body.title,
					headlineImage:downloadURL,
					content:req.body.content
				}}).then(()=> {return res.status(200).json({message:"Success"});});
			}
			catch(e) {
				return res.status(400).json({message:"Unexpected error"});
			}
		}
		});
	}

];
exports.deletePost = async (req,res) => {
	try {
		const PostObj = await Post.findById(req.params.postID);
		if (PostObj === null) {
			return res.status(400).json({message:"Post ID doesn't exist"});
		}
		Post.deleteOne({_id:req.params.postID}).then(()=> {return res.status(200).json({message:"Successfully deleted Post"})});
	}
	catch(e) {
		return res.status(400).json({message:"Couldn't reach DB",error:e});
	}
	// return res.status(200).json({message:"deletePost is not yet Implemented"});
};
exports.addPost = [
	// validates inputs
	body('title')
		.trim()
		.isLength({min:8})
		.withMessage("The title must be atleast 8 characters")
		.isLength({max:64})
		.withMessage("The title must not exceed by 32 characters"),
	body('content')
		.trim()
		.isLength({min:32})
		.withMessage("The content is below minimum requirements")
		.isLength({max:10000})
		.withMessage("The content is above maximum requirements"),
	(req,res) => {
		//checks if there is inputs anomaly else continue verify token
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({message:"Invalid requirements",errors:errors.array()});
		}
		if (!req.file  || Object.keys(req.file).length === 0) {
			return res.status(400).json({message:"No Image Extenstion"});
		}
		const fileSizeInBytes = req.file.size;

		// Define the maximum allowed file size (in bytes)
		const maxFileSize = 2 * 1024 * 1024; // 5MB

		// Check if the file size exceeds the maximum limit
		if (fileSizeInBytes > maxFileSize) {
			return res.status(400).json({message:"Image size exceeds 2 megabytes requirements"});
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
					return res.status(200).json({message:"Success",postId:result._id});
				})
				.catch((err)=> {
					console.log(err);
					return res.status(400).json({message:"Unexpected Error"});
			});
		}
	});
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
};
exports.addComment = [
	// validates inputs
	body("comment")
		.trim()
		.isLength({min:1,max:1000})
		.withMessage("The comment must be atleast 1 character and no more than 1000"),
	async (req,res) => {
		const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({message:"Invalid Requirments",errors:errors.array()})
			}
		try {
		 const PostObj = await Post.findById(req.params.postID).then((result)=> {return result});
		//  console.log(PostObj);
		 if (PostObj == null) {
			return res.status(400).json({message:"Post ID doesn't exist"});
		 }
		 const token = req.headers.authorization.split(" ")[1];
			let user = null;
			jwt.verify(token,process.env.SECRET_KEY,async (err,decoded) => {
				if (err) {
					return res.status(401).json({message:"Invalid JWT"}); //added redundancy for security
				}
				else {
					user = decoded.user._id;
				}
			});
			// console.log(req.body.comment);
			const newComment = await new Comment({
				user:user,
				comment:req.body.comment
			}).save().then(result => result);
			Post.updateOne({_id:req.params.postID},{$push:{comments:[newComment]}})
			.then(()=> {return res.status(200).json({message:"Success"})})
			.catch((err)=> {return res.status(400).json({message:"Unexpected Error"})});
		}
		catch(e) {
			return res.status(400).json({message:"Couldn't reach DB",error:e});
		}
	}
];
exports.addLike = async (req,res) => {
	// Toggle Likes status
	try {
		let PostObj = await Post.findById(req.params.postID).then((result)=> {return result});
        if (PostObj == null) {
            return res.status(400).json({message:"Post ID doesn't exist"});
        }
        const token = req.headers.authorization.split(" ")[1];
        let user = null;
        jwt.verify(token,process.env.SECRET_KEY,async (err,decoded) => {
            if (err) {
                return res.status(401).json({message:"Invalid JWT"}); //added redundancy for security
            }
            else {
                user = decoded.user._id;
            }
        });
		let CheckQuery = await Post.findOne({
			_id: req.params.postID,
		  })
		  .populate({path:"likes",match:{user:user}});
		if (CheckQuery.likes.length <= 0) {
			const newLike = await new Like({
				user:user
			}).save();
			Post.updateOne({_id:req.params.postID},{$push:{likes:[newLike]},$inc:{likesCount:1}})
			.then(()=> {return res.status(200).json({message:"Incremented"})})
			.catch((err)=> {return res.status(400).json({message:"Unexpected Error"})});
			return;
		}
		else {
			Post.updateOne(
				{ _id: req.params.postID },
				{
				  $pull: {
					likes: CheckQuery.likes[0]._id.toString()
				  },
				  $inc: { likesCount: -1 }
				}
			  )
			.then(()=> {return res.status(200).json({message:"Decremented"})})
			.catch((err)=> {return res.status(400).json({message:"Unexpected Error"})});
			return;
		}
	}
	catch(e) {
			return res.status(400).json({message:"Couldn't reach DB",error:e});
		}
};
exports.postCheckLike = async (req,res) => {
	try {
		let PostObj = await Post.findById(req.params.postID).then((result)=> {return result});
        if (PostObj == null) {
            return res.status(400).json({message:"Post ID doesn't exist"});
        }
        const token = req.headers.authorization.split(" ")[1];
        let user = null;
        jwt.verify(token,process.env.SECRET_KEY,async (err,decoded) => {
            if (err) {
                return res.status(401).json({message:"Invalid JWT"}); //added redundancy for security
            }
            else {
                user = decoded.user._id;
            }
        });
		let CheckQuery = await Post.findOne({
			_id: req.params.postID,
		  })
		  .populate({path:"likes",match:{user:user}});
		 if (CheckQuery.likes.length <= 0) {
			return res.status(200).json({message:"Not Liked"});
		 } else {
			return res.status(200).json({message:"Liked"});
		 }
	}
	catch (e) {
		return res.status(400).json({message:"Couldn't reach DB",error:e});
	}
};
