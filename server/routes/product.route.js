const express = require('express');
const { createProduct, updateProduct, deleteProduct, getProducts } = require('../controllers/product.controller.js');
const { verifyVendorOrAdmin, verifyAdminToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

// Vendor
router.post('/create', verifyAdminToken, createProduct);
router.put('/edit/:name', verifyVendorOrAdmin, updateProduct);
router.delete('/delete/:name', verifyVendorOrAdmin, deleteProduct);
router.get('/', verifyAdminToken, getProducts);

module.exports = router;
