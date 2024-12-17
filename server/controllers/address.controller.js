const { Op } = require('sequelize');
const { User, Address } = require('../models');
const { v4: uuidv4 } = require('uuid');
const address = require('../models/address');


const getAddress = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: {
                userId: req.userId,
            }
        });
        if (!addresses) { return res.status(401).json({ message: "Address doesn't exist" }) };

        return res.status(200).json({ Addresses: addresses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get address(es)" });
    };
};

const addAddress = async (req, res) => {
    const { firstname, lastname, phonenumber1, phonenumber2, address, additional_information, region, city, defaultaddress } = req.body;

    try {
        // Validate required fields
        if (!firstname || !lastname || !phonenumber1 || !address || !region || !city) {
            return res.status(400).json({ message: 'firstname, lastname, phonenumber1, address, region, and city are required.' });
        };

        // Change Old Default Address
        if (defaultaddress) {
            const [updateOldDefaultAddress] = await Address.update({ defaultaddress: false }, {
                where: {
                    defaultaddress: defaultaddress,
                    userId: req.userId
                }
            })
        };

        // Create Address
        const newAddress = await Address.create({
            id: uuidv4(),
            firstname: firstname,
            lastname: lastname,
            phonenumber1: phonenumber1,
            phonenumber2: phonenumber2,
            address: address,
            additional_information: additional_information,
            region: region,
            city: city,
            defaultaddress: defaultaddress,
            userId: req.userId,
        });

        return res.status(200).json({ message: `Address added successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add new address" });
    };
};


const updateAddress = async (req, res) => {
    const { addressId, firstname, lastname, phonenumber1, phonenumber2, address, additional_information, region, city, defaultaddress } = req.body;

    try {
        // check if address exists
        const addressExists = await Address.findOne({
            where: {
                id: addressId
            }
        });
        if (!addressExists) return res.status(401).json({ message: `Address doesn't exist` });

        if (firstname === "" || lastname === "" || phonenumber1 === "" || address === "" || region === "" || city === "") {
            return res.status(400).json({ message: 'firstname, lastname, phonenumber1, address, region, or city cannot be null.' })
        };

        const [updateAddress] = await Address.update({
            firstname,
            lastname,
            phonenumber1,
            phonenumber2,
            address,
            additional_information,
            region,
            city,
            defaultaddress
        }, {
            where: {
                id: addressId
            }
        });

        const updated_address = await Address.findOne({
            where: {
                id: addressId
            }
        });

        return res.status(200).json({ updatedAddress: updated_address });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update address" });
    };
};


const removeAddress = async (req, res) => {
    try {
        const deletedAddress = await Address.destroy({
            where: {
                id: req.body.addressId
            }
        });

        // Check if the address exists and was deleted
        if (deletedAddress) {
            return res.status(200).json({ message: 'Address deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Address not found' });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete address" });
    }
};


module.exports = { getAddress, addAddress, updateAddress, removeAddress };
