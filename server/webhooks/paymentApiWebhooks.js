const { Address } = require('../models');
const { initiatePayment, DirectGTBankAccountDebit, ValidatePaymentForDirectBankApiPayment, InitiateUSSDPayment, VerifyTransaction } = require('../services/paymentApi');
const payment_methods = require('../constants');

 
const canMakePayment = async () => {
    const payment_method = req.body.payment_method
    try {
        const defaultAddress = await Address.findOne({
            where: {
                defaultaddress: true,
                userId: req.userId
            }
        });

        if (!defaultAddress) { return res.status(400).json({ message: "An address hasn't been added for delivery" }) };

        if (!payment_methods.includes(payment_method)) {return res.status(400).json({ message: "Invalid payment method!" })};

        return res.status(200).json({ message: "Proceed to make payment" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Make sure you have a default address and have selected a payment method" });
    }
};


const initiatePaymentProcess = async () => {
    const { paymentMethod, currency } = req.body;
    
    try {
        if (paymentMethod === 'card') {

        } else if (paymentMethod === 'bank') {

        } else if (paymentMethod === 'ussd') {

        } else if (paymentMethod === 'transfer') {

        };

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to initiate payment" });
    }
};

const createOrder = () => {};

const cancelOrder = () => {};

const setOrderStatus = () => {};
