const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const memberController = require('./Controller/subscriberController')

require('dotenv').config();

mongoose.connect('mongodb+srv://sara:D4agHCYc69xNU8Ey@cluster0.l5nnz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/members');
 
const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
})

db.once('open', () => {
    console.log('Database Connection Established!');
});

const PORT = process.env.port || 8000

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome Home!');
})

app.listen(PORT, () => {
    console.log(`App listenting on port ${PORT}`);
});

app.use('/', memberController);