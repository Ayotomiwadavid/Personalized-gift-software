const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const memberRoutes = require('./Route/userRoute');
const cors = require('cors');

require('dotenv').config();

mongoose.connect('mongodb+srv://sara:D4agHCYc69xNU8Ey@cluster0.l5nnz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Members', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Database Connection Established!'));

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome Home!'));

// ✅ Fix: Use the correct router
app.use('/api', memberRoutes);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
