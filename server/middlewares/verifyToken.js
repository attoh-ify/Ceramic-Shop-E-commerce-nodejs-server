const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyUserToken = (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json({ message: "Token not found" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Token not valid" });
        req.userId = payload.id;

        next();
    })
};


const verifyVendorToken = (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json({ message: "Token not found" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Token not valid" });
        const user_ = await User.findOne({
            where: {
                id: payload.id
            }
        });
        if (user_.role === 'vendor') {
            req.userId = payload.id;
        } else {
            return res.status(403).json({ message: "Token not Authorised" });
        };

        next();
    })
};


const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json({ message: "Token not found" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Token not valid" });
        const user_ = await User.findOne({
            where: {
                id: payload.id
            }
        });
        if (user_.role === 'admin') {
            req.userId = payload.id;
        } else {
            return res.status(403).json({ message: "Admin access required" });
        };

        next();
    })
};


const verifyVendorOrAdmin = async (req, res, next) => {
    try {
        const vendorCheck = await verifyVendorToken(req, res, () => true);
        const adminCheck = await verifyAdminToken(req, res, () => true);

        if (vendorCheck || adminCheck) {
            return next(); // If either check passes, proceed to the controller
        }

        return res.status(403).json({ message: 'Access denied. Vendor or Admin authorization required.' });
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed.', error: error.message });
    }
};


module.exports = { verifyUserToken, verifyVendorToken, verifyAdminToken, verifyVendorOrAdmin };
