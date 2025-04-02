const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  replies: [{ text: String }]
});

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  comments: [commentSchema]
});

module.exports = mongoose.model('Blog', blogSchema);