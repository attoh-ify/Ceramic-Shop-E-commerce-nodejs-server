const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Cart } = require('../models');
const { v4: uuidv4 } = require('uuid');


const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // check if user exists
        const checkUsername = await User.findOne({
            where: {
                username: username
            }
        });
        if (checkUsername) return res.status(401).json({ message: 'Username already taken' });

        const checkEmail = await User.findOne({
            where: {
                email: email
            }
        });

        if (checkEmail) return res.status(401).json({ message: 'Email already registered' });

        // create user
        // hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = uuidv4();

        // Create User
        const newUser = await User.create({
            id: userId,
            username: username,
            email: email,
            password: hashedPassword
        });

        // Create Cart
        const userCart = await Cart.create({
            id: uuidv4(),
            total_quantity: 0,
            total_price: 0,
            userId: userId,
        });

        return res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to register user" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if email exists
        const checkUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (!checkUser) return res.status(401).json({ message: 'Invalid Credentials' });

        // check if email matches email
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);

        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid Credentials' });

        // create cookie
        const age = 1000 * 60 * 60 * 24  // token lasts for 24 hours

        const token = jwt.sign(
            {
                id: checkUser.id
            }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const { password: userPassword, ...userInfo } = checkUser.dataValues;

        res.cookie("userToken", token, {
            httpOnly: true,
            // secure: true,  // uncomment before production
            maxAge: age,
        }).status(200).json({ userInfo: userInfo, message: 'Login successful' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to login user" });
    }
};


const logout = async (req, res) => {
    try {
        res.clearCookie("userToken").status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to logout user" });
    };
};


const getProfile = async (req, res) => {
    try {
        const userProfile = await User.findOne({
            where: {
                id: req.userId
            }
        });

        const cart = await Cart.findOne({
            where: {
                userId: req.userId
            }
        });

        const { password: userPassword, ...userInfo } = userProfile.dataValues;

        return res.status(200).json({ userProfileDetails: userInfo, cartDetails: cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get users profile" });
    }
};


const updateProfile = async (req, res) => {
    const { password, role, ...userDetails } = req.body;

    try {
        const [updatedProfile] = await User.update(userDetails, {
            where: {
                id: req.userId
            }
        });

        // hash password
        if (password) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            const [updatedPassword] = await User.update({ password: hashedPassword }, {
                where: {
                    id: req.userId
                }
            });
        };

        const newUserProfile = await User.findOne({
            where: {
                id: req.userId
            }
        });
        const { password: userPassword, ...userInfo } = newUserProfile.dataValues;

        return res.status(200).json({ userProfileDetails: userInfo });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update user profile" });
    }
};


const deleteAccount = async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: {
                id: req.userId
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

module.exports = { register, login, logout, getProfile, updateProfile, deleteAccount };
