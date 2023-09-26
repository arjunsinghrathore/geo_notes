// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const geoNoteRoutes = require('./routes/geoNotes');


// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json()); // Allows us to handle JSON data
// app.use(cors()); // Handles CORS

// // Placeholder route for testing
// app.get('/', (req, res) => {
//     res.send('Geo-Notes Backend is Running');
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB', err));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });

// const authRoutes = require('./routes/auth');

// // Use Routes
// app.use('/api/auth', authRoutes);

// app.use('/api/geo-notes', geoNoteRoutes);

const GeoNote = require('./models/GeoNote');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const geoNoteRoutes = require('./routes/geoNotes');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allows us to handle JSON data
app.use(cors()); // Handles CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Ensure indexes are created for GeoNote model
        GeoNote.ensureIndexes().catch(err => {
            console.error(err);
        });

        // Start the server
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB', err);
    });

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/geo-notes', geoNoteRoutes);

// Placeholder route for testing
app.get('/', (req, res) => {
    res.send('Geo-Notes Backend is Running');
});

