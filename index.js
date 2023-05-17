require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');

// MongoDB Setup
require('./configs/mongodb-config');
// Firebase Setup
require('./configs/firebase-config');
// Express Setup
const port = 5454;
const app = express();

// PassportJS Setup
require('./configs/passport');

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
