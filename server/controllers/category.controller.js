const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Category } = require('../models');
const { v4: uuidv4 } = require('uuid');


const createCategory = async (req, res) => {
    const { name, description, slug } = req.body;

    try {
        // check if name is taken
        const name_ = await Category.findOne({
            where: {
                name: name
            }
        });
        if (name_) return res.status(401).json({ message: 'Category name taken' });

        const newCategory = await Category.create({
            name: name,
            description: description,
            slug: slug
        });

        return res.status(200).json({ message: `${name} Category created successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add new category" });
    };
};


module.exports = { createCategory };
