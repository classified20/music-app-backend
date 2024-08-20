const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (request, response) => {
    const { name, email, password } = request.body;
    try {
        const user = await User.create({username, email, password});
        const token = jwt.sign({id: user._id }, '578ad2b1ac47aef7768104fbc094c7e087dd7ce8692bd0976e5bd85c8d42ea99', { expiresIn: '1h'});
        response.json({ token, user });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});

router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return response.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, '578ad2b1ac47aef7768104fbc094c7e087dd7ce8692bd0976e5bd85c8d42ea99', { expiresIn: '1h'});
        response.json({ token, user});
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});

module.exports = router;