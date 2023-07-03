const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	author:{type:Schema.Types.ObjectId,ref:"User",required:true},
	title:{type:String,minLength:8,maxLength:32},
	headlineImage:{type:String},
	content:{type:String,minLength:32,maxLength:10000},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
		}
	],
});

module.exports = mongoose.model("Post",postSchema);
