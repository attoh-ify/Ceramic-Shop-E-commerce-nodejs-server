const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth.route.js');
const adminRoute = require('./routes/admin.route.js');
const categoryRoute = require('./routes/category.route.js');

const PORT = process.env.PORT || 5000;

const server = express();

// Add middlewares
server.use(express.json());
server.use(cookieParser());
server.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

server.use('/auth', authRoute);
server.use('/admin', adminRoute);
server.use('/', categoryRoute);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});