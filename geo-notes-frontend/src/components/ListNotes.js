import React from 'react';
import axios from 'axios';

function ListNotes({ notes, handleView, handleEdit, handleDelete }) {
    return (
      <div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {notes.map(note => (
            <li key={note._id} style={{ border: '1px solid #ccc', margin: '20px 0', padding: '15px', borderRadius: '10px', backgroundColor: '#F5F5F5' }}>
              <h3 style={{ fontSize: '1.5rem', margin: '0', color: '#333' }}>{note.title}</h3>
              <p style={{ fontSize: '1rem', margin: '10px 0', color: '#555' }}>{note.content}</p>
              <p style={{ fontSize: '0.9rem', margin: '5px 0', color: '#777' }}>Coordinates: {note.location.coordinates[0]}, {note.location.coordinates[1]}</p>
              <p style={{ fontSize: '0.9rem', margin: '5px 0', color: '#777' }}>Public: {note.isPublic ? "Yes" : "No"}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '15px', marginTop: '10px' }}>
                <button style={{ backgroundColor: '#E98074', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleView(note)}>View</button>
                <button style={{ backgroundColor: '#D8C3A5', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleEdit(note)}>Edit</button>
                <button style={{ backgroundColor: '#EAE7DC', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

export default ListNotes;
