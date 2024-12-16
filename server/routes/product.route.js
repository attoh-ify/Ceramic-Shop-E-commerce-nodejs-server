const express = require('express');
const { createProduct, updateProduct, deleteProduct, getProducts } = require('../controllers/product.controller.js');
const { verifyUserToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

// Vendor
router.post('/create', verifyUserToken, createProduct);
router.put('/edit/:name', verifyUserToken, updateProduct);
router.delete('/delete/:name', verifyUserToken, deleteProduct);
router.get('/', getProducts);

module.exports = router;
