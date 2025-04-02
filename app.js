const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/blogApp', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/blogs', blogRoutes);

app.listen(3000, () => console.log('Server started on http://localhost:3000'));