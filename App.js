const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://jmulebeke1:joel123@cluster0.hep4fte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
.catch(error => console.log(error));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/music',require('./routes/music'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));