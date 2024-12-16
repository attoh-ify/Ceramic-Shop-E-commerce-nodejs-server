const { Op } = require('sequelize');
const { User, Category, Product } = require('../models');
const { v4: uuidv4 } = require('uuid');


const createProduct = async (req, res) => {
    const { name, description, price, currency, color, material, tags, stock, category } = req.body;

    try {
        // check if name is taken
        const existingProduct = await Product.findOne({ where: { name: name } });
        if (existingProduct) return res.status(409).json({ message: `A product with the name "${name}" already exists.` });

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required.' });
        };

        // Get category id
        const categoryId = await Category.findOne({ where: { name: category }});

        // Create Product
        const newCategory = await Product.create({
            id: uuidv4(),
            name,
            description,
            price,
            currency,
            color,
            material,
            tags,
            stock,
            categoryId: categoryId.dataValues.id,
            userId: req.userId,
        });

        return res.status(200).json({ message: `${name} Product created successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add new product" });
    };
};


const updateProduct = async (req, res) => {
    const { slug } = req.params;

    try {
        // check if product exists
        const product_ = await Product.findOne({
            where: {
                slug: slug
            }
        });
        if (!product_) return res.status(401).json({ message: `Product doesn't exist` });
        
        const [updateProduct] = await Product.update(req.body, {
            where: {
                slug: slug
            }
        });

        return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update product" });
    };
};


const deleteProduct = async (req, res) => {
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


const getProducts = async (req, res) => {
    const {
        category,
        priceMin,
        priceMax,
        sortBy = 'createdAt',
        order = 'DESC',
        page = 1,
        limit = 10,
        vendor_name,
    } = req.query;

    try {
        // Build the `where` clause for filtering
        const where = {};
        if (priceMin) where.price = { ...(where.price || {}), [Op.gte]: priceMin }; // Minimum price
        if (priceMax) where.price = { ...(where.price || {}), [Op.lte]: priceMax }; // Maximum price

        // get the vendors id
        if (vendor_name) {
            const vendor = await User.findOne({
                where: {
                    username: vendor_name
                }
            });
            if (vendor) {where.userId = vendor.dataValues.id}; // Filter by vendor
        };
        // get category id
        if (category) {
            const category_ = await Category.findOne({
                where: {
                    name: category
                }
            });
            console.log(category_.dataValues.id);
            if (category_) {where.categoryId = category_.dataValues.id}; // Filter by category
        };

        // Calculate pagination
        const pageNum = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);
        const offset = (pageNum - 1) * pageLimit;

        // Query the database
        const { rows: products, count: totalItems } = await Product.findAndCountAll({
            where,
            order: [[sortBy, order]], // Sorting
            limit: pageLimit, // Pagination limit
            offset, // Pagination offset
        });

        // Calculate metadata
        const totalPages = Math.ceil(totalItems / pageLimit);

        // Respond with the paginated data
        return res.status(200).json({
            products,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNum,
                pageSize: pageLimit,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch products" });
    };
};


module.exports = { createProduct, updateProduct, deleteProduct, getProducts };
