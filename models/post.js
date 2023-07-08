const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	author:{type:Schema.Types.ObjectId,ref:"User",required:true},
	title:{type:String,minLength:8,maxLength:64},
	headlineImage:{type:String},
	content:{type:String,minLength:32,maxLength:10000},
	likesCount:{type:Number,default:0},
	likes:[{type:Schema.Types.ObjectId,ref:"Like"}],
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Post",postSchema);
