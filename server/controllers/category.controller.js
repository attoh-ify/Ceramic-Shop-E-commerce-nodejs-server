const { Category } = require('../models');


const getCategories = async (req, res) => {
    try {
        const allCategories = await Category.findAll();

        return res.status(200).json({ categories: allCategories });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get all categories" });
    };
};


const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                slug: req.params.slug
            }
        });

        return res.status(200).json({ categories: category });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get category" });
    };
};


module.exports = { getCategories, getCategory };
