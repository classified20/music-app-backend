const express = require('express');
const multer = require('multer');
const Song = require('../models/Song');
const jwt = require('jsonwebtoken');
const path = require('path');

const router = express.Router();

const verifyToken = (request, response, next) => {
    const token = request.headers['authorization'];
    if(!token) return response.status(403).json({ error: 'No token provided'});
    jwt.verify(token, '578ad2b1ac47aef7768104fbc094c7e087dd7ce8692bd0976e5bd85c8d42ea99', (err, decoded) => {
        if(error) return response.status(500).json({ error: 'Failed to authenticate token'});
        request.userId = decoded.id;
        next();
    });

};

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload', verifyToken, upload.single('Song'), async (request, response) => {
    const { title, artist } = request.body;
    const userId = request.userId;

    const newSong = new Song({
        title,
        artist,
        url: `/upload/${request.file.filename}`,
        user: userId
    });

    await newSong.save();

    response.json ({ song: newSong });
});

router.get('/', async (request, response) => {
    const songs = await Song.find().populate('user', username);
    response.json(songs);
});

module.exports = router;