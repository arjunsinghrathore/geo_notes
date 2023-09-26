import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import worldMap from './world_map.jpeg';  // Import the background image

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // State to hold error messages
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', formData);
      console.log(response.data);
      localStorage.setItem('auth-token', response.data.token);
      setErrorMessage(''); // Clear any previous error messages
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error registering user:", error.response.data.message);
      setErrorMessage(error.response.data.message); // Set the error message from the backend
    }
  };

  const login_page = () => {
    // Redirect user to login page
    navigate('/login')
  };

  const goToHomePage = () => {
    // Redirect user to home page
    navigate('/');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" 
         style={{ 
             backgroundImage: `url(${worldMap})`, 
             backgroundSize: 'cover', 
             backgroundPosition: 'center center',
             backgroundColor: 'rgba(0, 0, 0, 0.5)' 
         }}>
      <button className="btn btn-primary home-btn" onClick={goToHomePage}>Home</button> {/* Updated this line */}
      <div className="card p-4" style={{ width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h2 className="text-center mb-4">Register</h2>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
        </form>
        <div className="text-center mt-3">
          <p>Already registered? <button className="btn btn-link p-0" onClick={login_page}>Login</button></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
