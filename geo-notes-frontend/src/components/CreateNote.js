import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateNote({ onNoteAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    isPublic: false  // Added this field
  });
  const [message, setMessage] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setDetectedLocation({ latitude, longitude });
        }, (error) => {
            console.error("Error obtaining location:", error);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'latitude' || e.target.name === 'longitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: e.target.name === 'latitude'
            ? [parseFloat(e.target.value), formData.location.coordinates[1]]
            : [formData.location.coordinates[0], parseFloat(e.target.value)]
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      await axios.post('/api/geo-notes/add', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      setMessage('Note added successfully!');
      setFormData({
        title: '',
        content: '',
        location: {
          type: 'Point',
          coordinates: [0, 0]
        },
        isPublic: false
      });
      onNoteAdded(); // Call the callback after adding the note
    } catch (error) {
      console.error("Error adding note:", error.response.data);
      setMessage('Error adding note. Please try again.');
    }
};


return (
    <div style={{ backgroundColor: '#F5E9E2', padding: '20px', borderRadius: '10px', width: '100%' }}>
        {message && <p style={{ color: '#E98074' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Title:</label>
                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Content:</label>
                <textarea className="form-control" name="content" value={formData.content} onChange={handleChange} rows="4" required></textarea>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Latitude:</label>
                    <input type="number" className="form-control" name="latitude" value={formData.location.coordinates[0]} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Longitude:</label>
                    <input type="number" className="form-control" name="longitude" value={formData.location.coordinates[1]} onChange={handleChange} required />
                </div>
            </div>
            <div className="mb-3 form-check">
                <input 
                    type="checkbox" 
                    className="form-check-input"
                    name="isPublic" 
                    checked={formData.isPublic} 
                    onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                />
                <label className="form-check-label">Public Note</label>
            </div>
            {detectedLocation && (
                <div className="mb-3">
                    <p>Detected Location: {detectedLocation.latitude}, {detectedLocation.longitude}</p>
                    <button type="button" className="btn btn-outline-dark mb-3" onClick={() => setFormData({
                        ...formData,
                        location: {
                            ...formData.location,
                            coordinates: [detectedLocation.latitude, detectedLocation.longitude]
                        }
                    })}>
                        Use Detected Location
                    </button>
                </div>
            )}
            <button type="submit" className="btn btn-dark">Add Note</button>
        </form>
    </div>
);
}

export default CreateNote;