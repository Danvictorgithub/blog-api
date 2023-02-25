require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');

// MongoDB Setup
const mongoDB = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'MongoDB Connection Error'));

// Express Setup
const port = 5454;
const app = express();

// PassportJS Setup
require('./routes/passport');

// Express Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api",apiRoutes);
app.listen(port,()=> {
	console.log(`Listening to port ${port}!`);
});
