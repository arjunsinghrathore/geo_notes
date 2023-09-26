const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            // index: '2dsphere'  // Add this line
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    isPublic: {
        type: Boolean,
        default: false
    }
});

NoteSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Note', NoteSchema);
