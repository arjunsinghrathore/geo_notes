import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateNote from './CreateNote';
import ListNotes from './ListNotes';
import Modal from './Modal';
import NotesMap from './NotesMap';
import { useNavigate } from 'react-router-dom';
// import worldMap from './world_map.jpeg';  // Import the background image

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [notes, setNotes] = useState([]);
  const [refresh, setRefresh] = useState(false); // State to trigger refresh of notes
  const [selectedNote, setSelectedNote] = useState(null); // State to hold the note selected for viewing or editing
  const [userLocation, setUserLocation] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'view', 'edit'


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('auth-token');
      try {
        const response = await axios.get('/api/auth/user-data', {
          headers: {
            'x-auth-token': token
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response.data);
        if (error.response && error.response.data.message === 'Invalid token.') {
          localStorage.removeItem('auth-token');
          // Redirect user to login page or show a message prompting them to log in again
        }
      }
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setUserLocation([latitude, longitude]);
        });
    }

    fetchData();
    fetchNotes();
  }, [refresh]);

  const fetchNotes = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      const response = await axios.get('/api/geo-notes/all', {
        headers: {
          'x-auth-token': token
        }
      });
      console.log("API Response:", response); // Log the response for debugging
      if (response && response.data) {
        setNotes(response.data);
      } else {
        console.error("API response is missing 'data' property or is undefined.");
      }
    } catch (error) {
      console.error("Error fetching notes:", error.response ? error.response.data : error.message);
    }
  };

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

const handleView = (note) => {
    setSelectedNote(note);
    setView('view');
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
  };

  const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === "latitude" || name === "longitude") {
            const updatedCoordinates = name === "latitude"
                ? [parseFloat(value), selectedNote.location.coordinates[1]]
                : [selectedNote.location.coordinates[0], parseFloat(value)];
            setSelectedNote(prevNote => ({
                ...prevNote,
                location: {
                    ...prevNote.location,
                    coordinates: updatedCoordinates
                }
            }));
        } else if (name === "isPublic") {
            setSelectedNote(prevNote => ({
              ...prevNote,
              isPublic: e.target.checked
            }));
          } else {
            setSelectedNote(prevNote => ({
              ...prevNote,
              [name]: value
            }));
          }
        };



    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to update this note?")) {
            try {
                const token = localStorage.getItem('auth-token');
                await axios.put(`/api/geo-notes/${selectedNote._id}`, selectedNote, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setView('list'); // Return to the list view after updating
            } catch (error) {
                console.error("Error updating note:", error.response.data);
            }
        }
    };
    
    const handleDelete = async (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                const token = localStorage.getItem('auth-token');
                await axios.delete(`/api/geo-notes/${noteId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setRefresh(prev => !prev); // Refresh the notes list after deletion
            } catch (error) {
                console.error("Error deleting note:", error.response.data);
            }
        }
    };
    
    const handleBackFromEdit = () => {
        if (window.confirm("Are you sure you want to cancel your update?")) {
            setView('list');
        }
    };

    const navigate = useNavigate(); // Initialize the useHistory hook


  const logout = () => {
    localStorage.removeItem('auth-token');
    // Redirect user to login page or update state to reflect logged-out status
    navigate('/login')
  };

  const goToHomePage = () => {
    // Redirect user to home page
    navigate('/');
  };

  return (
    <div className="container-fluid animatedGradient">
      <div className="row">
        <div className="col-md-3 p-4 d-flex flex-column createNotePanel" style={{ maxHeight: 'auto' }}>
          <h2 className="mb-4" style={{ color: '#333' }}>Create a new Geo-Note!</h2>
          <CreateNote onNoteAdded={() => setRefresh(prev => !prev)} />
        </div>
        <div className="col-md-8 p-4 d-flex flex-column notesListPanel" style={{ maxWidth: '80%' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: '#EAE7DC' }}>Your Geo-Notes</h2>
            <button className="btn btn-light logoutButton" onClick={logout}>Logout</button>
            <button className="btn btn-primary home-btn-dash" onClick={goToHomePage}>Home</button>
          </div>
          <div className="notesListContent" style={{ width: '100%' }}>
            {view === 'list' && <ListNotes notes={notes} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete} />}
            {view === 'view' && selectedNote && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.7rem', color: '#333' }}>{selectedNote.title}</h3>
                  <p style={{ fontSize: '1.2rem', color: '#555' }}>{selectedNote.content}</p>
                  <p style={{ fontSize: '1rem', color: '#777' }}>Coordinates: {selectedNote.location.coordinates[0]}, {selectedNote.location.coordinates[1]}</p>
                  <p style={{ fontSize: '1rem', color: '#777' }}>Public: {selectedNote.isPublic ? "Yes" : "No"}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <button style={{ padding: '10px 15px', backgroundColor: '#D8C3A5', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setView('edit')}>Edit</button>
                  <button style={{ padding: '10px 15px', backgroundColor: '#E98074', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={handleBackToList}>Back to List</button>
                </div>
              </div>
            )}
            {view === 'edit' && selectedNote && (
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label>Title:</label>
                  <input type="text" name="title" value={selectedNote.title} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label>Content:</label>
                  <textarea name="content" value={selectedNote.content} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <label>Latitude:</label>
                    <input type="number" name="latitude" value={selectedNote.location.coordinates[0]} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                  </div>
                  <div>
                    <label>Longitude:</label>
                    <input type="number" name="longitude" value={selectedNote.location.coordinates[1]} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                  </div>
                </div>
                <div>
                  <label>Public:</label>
                  <input 
                    type="checkbox" 
                    name="isPublic" 
                    checked={selectedNote.isPublic} 
                    onChange={handleEditChange}
                    style={{ marginLeft: '10px' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <button style={{ padding: '8px 12px', backgroundColor: '#D8C3A5', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="button" onClick={handleBackFromEdit}>Back</button>
                  <button style={{ padding: '8px 12px', backgroundColor: '#E98074', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">Update Note</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <NotesMap notes={notes} userLocation={userLocation} />
        </div>
      </div>
    </div>
);



}

export default Dashboard;