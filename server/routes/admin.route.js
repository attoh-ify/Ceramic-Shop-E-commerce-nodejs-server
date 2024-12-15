const express = require('express');
const { updateUserProfile, deleteUser, createCategory, updateCategory, deleteCategory } = require('../controllers/admin.controller.js');
const { verifyAdminToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

// Auth
router.put('/user/update/', verifyAdminToken, updateUserProfile);
router.delete('/user/delete', verifyAdminToken, deleteUser);
// Category
router.post('/category/create', verifyAdminToken, createCategory);
router.put('/category/edit/:slug', verifyAdminToken, updateCategory);
router.delete('/category/delete/:slug', verifyAdminToken, deleteCategory);

module.exports = router;
