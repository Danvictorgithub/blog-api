const {getStorage,ref, uploadBytes,getDownloadURL} = require("firebase/storage");
const Post = require('../models/post');

exports.getAllPost = (req,res) => {
	res.json({message:"Not yet Implemented"});
};
exports.addDummyPost = (req,res) => {
	res.json({message:"Not yet Implemented"});
};
exports.addPost = (req,res) => {
	res.json({message:"Not yet Implemented"});
};
exports.postImageHandler = async (req,res) => {
	// returns imgURL
	const storage = getStorage();
	const imageRef = ref(storage,`BlogProject/images/${req.file.originalname}`);
	const metadata = {contentType:req.file.mimetype};
	const snapshot = await uploadBytes(imageRef,req.file.buffer,metadata);
	const downloadURL = await getDownloadURL(ref(storage,snapshot.metadata.fullPath));
	return res.status(200).json({message:"success",img:downloadURL});
}