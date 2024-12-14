const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Category } = require('../models');
const { v4: uuidv4 } = require('uuid');


//
const deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const deletedUser = await User.destroy({
            where: {
                id: userId
            }
        });

        // Check if the user exists and was deleted
        if (deletedUser) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete user" });
    }
};


// Category
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
            id: uuidv4(),
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


const updateCategory = async (req, res) => {
    const { slug } = req.params;

    try {
        // check if category is exists
        const category_ = await Category.findOne({
            where: {
                slug: slug
            }
        });
        if (!category_) return res.status(401).json({ message: `Category doesn't exist` });
        
        const [updateCategory] = await Category.update(req.body, {
            where: {
                slug: slug
            }
        });

        return res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update category" });
    };
};


const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.destroy({
            where: {
                slug: req.params.slug
            }
        });

        // Check if the category exists and was deleted
        if (deletedCategory) {
            return res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Category not found' });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete category" });
    }
};


module.exports = { deleteUser, createCategory, updateCategory, deleteCategory };
