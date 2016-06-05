/**
 * Created by martins on 6/1/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    productName: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    posterId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    postDate: {
        type: Date,
    },
    imageLinks: []
});

module.exports = mongoose.model('Post', postSchema);
