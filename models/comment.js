const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    comment: {type: String, minLength: 1, maxLength: 1000},
    date: {type: Date,default:Date.now}
});

module.exports = mongoose.model("Comment",commentSchema);
