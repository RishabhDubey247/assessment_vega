const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const router = express.Router();
const { validateBlog } = require('../middleware/validators');
const upload = multer({ dest: 'public/uploads/' });

router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.render('blogList', { blogs });
});

router.get('/new', (req, res) => {
  res.render('blogForm', {title: 'New Blog'  });
});

router.post('/new', upload.single('image'), validateBlog, async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    description: req.body.description,
    image: `/uploads/${req.file.filename}`
  });
  await blog.save();
  res.redirect('/blogs');
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('blogDetail', { blog });
});

router.get('/edit/:id', validateBlog, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('blogForm', { blog });
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.title = req.body.title;
  blog.description = req.body.description;
  if (req.file) blog.image = `/uploads/${req.file.filename}`;
  await blog.save();
  res.redirect('/blogs');
});

router.post('/delete/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/blogs');
});

module.exports = router;