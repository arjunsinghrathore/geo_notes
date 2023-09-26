import React from 'react';
import { Link } from 'react-router-dom';
import globeVid from './vecteezy_3d-animated-low-poly-earth-with-clay-look_2270498.mp4';  // Import the background image

function HomePage() {
    return (
        <div className="video-container">
            <video autoPlay loop muted className="background-video">
                <source src={globeVid} type="video/mp4" />
            </video>
            <div className="content">
                <div className="about-section">
                    <h1>About Geo-Notes</h1>
                    <p>Imagine a world where every memory, every fleeting thought, and every cherished moment is anchored to a special place on Earth. Welcome to Geo-Notes, a magical realm where your notes transcend the boundaries of paper and find a home amidst the vast landscapes of our planet. As you journey through life, let every adventure, every whisper of the wind, and every heartbeat be etched onto the canvas of the world. With Geo-Notes, you're not just exploring the globe; you're weaving your own tapestry of memories, making every corner of the world a part of your story. Embark on this enchanting voyage, and let the world be your diary. Dive in, dream big, and let Geo-Notes be the compass that guides your heart's desires.</p>
                </div>
                <div className="action-buttons">
                    <Link to="/register" className="register-btn">Register Now</Link>
                    <p>If you're already a user, <Link to="/login">login here</Link>.</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
