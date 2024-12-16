const { Cart, CartItem, Product } = require('../models');
const { v4: uuidv4 } = require('uuid');


const amendCart = async (quantity, cartId, productId) => {
    try {
        // Get Product price
        const product = await Product.findOne({
            where: {
                id: productId
            }
        });

        // Get Cart total quantity and price
        const cart = await Cart.findOne({
            where: {
                id: cartId,
            }
        });
        const cart_total_quantity = parseInt(cart.dataValues.total_quantity, 10);
        const cart_total_price = Number(cart.dataValues.total_price);

        // Get new total quantity and price
        const new_total_quantity = cart_total_quantity + parseInt(quantity, 10);
        const new_total_price = cart_total_price + (parseInt(quantity, 10) * Number(product.dataValues.price));

        const [updatedCart] = await Cart.update({ total_quantity: new_total_quantity, total_price: new_total_price }, {
            where: {
                id: cartId
            }
        });
    } catch (error) {
        console.log(error);
        console.log("Failed to amend Cart");
    };
};


const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: {
                userId: req.userId
            }
        });
        if (!cart) { return res.status(401).json({ message: 'Cart does not exist' }) };

        return res.status(200).json({ message: cart.dataValues });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get Cart" });
    };
};


const addCartItem = async (req, res) => {
    const { quantity, productId } = req.body;
    try {
        // Get cartId
        const cart = await Cart.findOne({
            where: {
                userId: req.userId
            }
        });
        if (!cart) { return res.status(401).json({ message: "Cart doesn't exist." }) };

        const CartItemExists = await CartItem.findOne({
            where: {
                cartId: cart.dataValues.id,
                productId: productId
            }
        });
        if (CartItemExists) { return res.status(401).json({ message: "Product already added to cart" }) };

        // Amend cart
        amendCart(quantity, cart.dataValues.id, productId);

        // Create cart item
        const newCartItem = await CartItem.create({
            id: uuidv4(),
            quantity: quantity,
            cartId: cart.dataValues.id,
            productId: productId,
        });
        return res.status(200).json({ message: "Cart Item added succesfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create cart item" });
    }
};


const getCartItems = async (req, res) => {
    try {
        // Get cartId
        const cartItems = await CartItem.findAll({
            where: {
                cartId: req.body.cartId
            }
        });

        return res.status(200).json({ message: cartItems })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get cart item(s)" });
    }
};


const editCartItem = async (req, res) => {
    try {
        const oldCartItem = await CartItem.findOne({
            where: {
                id: req.body.cartItemId
            }
        });
        const oldQuantity = parseInt(oldCartItem.dataValues.quantity, 10);
        const productId = oldCartItem.dataValues.productId;
        const extraQuantity = parseInt(req.body.quantity) - oldQuantity;
        console.log(extraQuantity)
        console.log(oldCartItem.dataValues.cartId)

        // Amend Cart
        amendCart(extraQuantity, oldCartItem.dataValues.cartId, productId);

        const [editedCartItem] = await CartItem.update({ quantity: req.body.quantity }, {
            where: {
                id: req.body.cartItemId
            }
        });

        const newCartItem = await CartItem.findOne({
            where: {
                id: req.body.cartItemId
            }
        });

        return res.status(200).json({ cartItem: newCartItem });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to edit cart item" });
    }
};


const removeCartItem = async (req, res) => {
    try {
        // Get cart item
        const cart_item = await CartItem.findOne({
            where: {
                id: req.body.cartItemId
            }
        });

        // Get Cart Item Product
        const product = await Product.findOne({
            where : {
                id: cart_item.dataValues.productId
            }
        });

        // Get Cart total quantity and price
        const cart = await Cart.findOne({
            where: {
                id: cart_item.dataValues.cartId
            }
        });

        const cart_item_quantity = parseInt(cart_item.dataValues.quantity, 10);
        const cart_item_price = Number(product.dataValues.price);

        // Get new total quantity and price
        const new_total_quantity = parseInt(cart.dataValues.total_quantity, 10) - cart_item_quantity;
        const new_total_price = Number(cart.dataValues.total_price) - (cart_item_quantity * cart_item_price);

        const [updatedCart] = await Cart.update({ total_quantity: new_total_quantity, total_price: new_total_price }, {
            where: {
                id: cart_item.dataValues.cartId
            }
        });

        const removeCartItem = await CartItem.destroy({
            where: {
                id: req.body.cartItemId
            }
        });

        // Check if the cart item exists and was deleted
        if (removeCartItem) {
            return res.status(200).json({ message: 'Cart Item deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Cart Item not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to remove cart item" });
    }
};


module.exports = { getCart, addCartItem, getCartItems, editCartItem, removeCartItem };
