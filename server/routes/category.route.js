const express = require('express');
const { createCategory } = require('../controllers/category.controller.js');
const { verifyAdminToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

// Admin
router.post('/admin/createCategory', verifyAdminToken, createCategory);  // Add a new category (admin-only)


module.exports = router;
