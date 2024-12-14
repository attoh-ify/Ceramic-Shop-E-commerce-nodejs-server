const express = require('express');
const { getCategories, getCategory } = require('../controllers/category.controller.js');
const { verifyUserToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

router.get('/get-all', verifyUserToken, getCategories);
router.get('/get/:slug', verifyUserToken, getCategory);

module.exports = router;
