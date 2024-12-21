const { Address } = require('../models');

const initiatePayment = async () => {
    const { paymentMethod } = req.body;
    
    try {
        const defaultAddress = await Address.findOne({
            where: {
                defaultaddress: true,
                userId: req.userId
            }
        });

        if (!defaultAddress) { return res.status(400).json({ message: "An address hasn't been added for delivery" }) };


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to initiate payment" });
    }
};

const processPayment = () => {};

const createOrder = () => {};

const cancelOrder = () => {};

const setOrderStatus = () => {};

