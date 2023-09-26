const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const GeoNote = require('../models/GeoNote');


router.post('/add', auth, async (req, res) => {
    const { title, content, location, isPublic } = req.body;

    // Create a new geo-note
    const geoNote = new GeoNote({
        userId: req.user._id,
        title,
        content,
        location,
        isPublic
    });

    try {
        const savedGeoNote = await geoNote.save();
        res.json({ message: 'Geo-note added successfully', geoNoteId: savedGeoNote._id });
    } catch (err) {
        res.status(500).json({ message: 'Error adding geo-note', error: err });
    }
});

// Retrieve all geo-notes for a user
router.get('/all', auth, async (req, res) => {
    try {
        const notes = await GeoNote.find({ userId: req.user._id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});

// retrieve a specific geo note by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const note = await GeoNote.findOne({ _id: req.params.id, userId: req.user._id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching note', error: err });
    }
});

// update a geo note
router.put('/:id', auth, async (req, res) => {
    const { title, content, location, isPublic } = req.body;
    try {
        let note = await GeoNote.findOne({ _id: req.params.id, userId: req.user._id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        note.title = title;
        note.content = content;
        note.location = location;
        note.isPublic = isPublic; // Update the isPublic status
        await note.save();
        res.json({ message: 'Note updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating note', error: err });
    }
});

// delete a geo note
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await GeoNote.deleteOne({ _id: req.params.id, userId: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note', error: err });
    }
});


  


module.exports = router;
