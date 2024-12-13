const jwt = require('jsonwebtoken');
const User = require('../models');

const verifyUserToken = (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json({ message: "Token not found" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Token not valid" });
        req.userID = payload.id;

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
            return res.status(403).json({ message: "Token not Authorised" });
        };
        req.userId = payload.id;

        next();
    })
};


module.exports = { verifyUserToken, verifyAdminToken };
