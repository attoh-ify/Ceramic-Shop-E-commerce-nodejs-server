const express = require('express');
const { getAddress, addAddress, updateAddress, removeAddress } = require('../controllers/address.controller.js');
const { verifyUserToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

router.get('/', verifyUserToken, getAddress);
router.post('/add/', verifyUserToken, addAddress);
router.put('/update/', verifyUserToken, updateAddress);
router.delete('/remove/', verifyUserToken, removeAddress);

module.exports = router;
