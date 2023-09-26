const mongoose = require('mongoose');

const GeoNoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
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
        //   index: '2dsphere'  // Add this line
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

GeoNoteSchema.index({ location: '2dsphere' });

// Create a GeoNote model from the schema
const GeoNote = mongoose.model('GeoNote', GeoNoteSchema);

module.exports = GeoNote;
