import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Fix for the default icon URLs
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function NotesMap({ notes, userLocation, selectedNote }) {
  const defaultPosition = [40.73009, -74.04275]; // Default to some location, adjust as needed

  // Determine the center based on selectedNote or userLocation
  const center = selectedNote 
                ? [selectedNote.location.coordinates[0], selectedNote.location.coordinates[1]]
                : userLocation || defaultPosition;

  // Component to update the map's center
  function MapUpdater() {
    const map = useMap();
    map.setView(center);
    return null; // This component doesn't render anything
  }

  return (
    <MapContainer center={center} zoom={13} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater />
      {notes.map(note => (
        <Marker
          key={note._id}
          position={[note.location.coordinates[0], note.location.coordinates[1]]}
        >
          <Popup>
            <strong>{note.title}</strong><br />
            {note.content}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default NotesMap;
