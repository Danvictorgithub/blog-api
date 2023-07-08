const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    comment: {type: String},
    date: {type: Date,default:Date.now}
});

module.exports = mongoose.model("Comment",commentSchema);
