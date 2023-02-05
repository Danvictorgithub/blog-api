require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');


// MongoDB Setup
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'MongoDB Connection Error'));

// Express Setup
const port = 3000;
const app = express();

// Express Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port,()=> {
	console.log(`Listening to port ${port}!`);
});




