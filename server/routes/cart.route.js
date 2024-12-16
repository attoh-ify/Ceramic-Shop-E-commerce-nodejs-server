const express = require('express');
const { getCart, addCartItem, getCartItems, editCartItem, removeCartItem } = require('../controllers/cart.controller.js');
const { verifyUserToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

router.get('/cart', verifyUserToken, getCart);  // get user cart
router.post('/add', verifyUserToken, addCartItem);  // add new cart item
router.get('/cart-items', verifyUserToken, getCartItems);  // get cart items
router.put('/edit', verifyUserToken, editCartItem);  // edit cart item
router.delete('/remove', verifyUserToken, removeCartItem);  // remove cart item

module.exports = router;
