const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    comment: {type: String}
});

module.exports = mongoose.model("Comment",commentSchema);
