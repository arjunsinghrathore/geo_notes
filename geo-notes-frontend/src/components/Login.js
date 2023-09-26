import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import worldMap from './world_map.jpeg';

function Login() {
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

  const navigate = useNavigate(); // Initialize the useHistory hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      console.log(response.data);
      localStorage.setItem('auth-token', response.data.token);
      setErrorMessage(''); // Clear any previous error messages
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Error logging in:", error.response.data.message);
      setErrorMessage(error.response.data.message); // Set the error message from the backend
    }
  };


  const register_page = () => {
    // Redirect user to register page
    navigate('/register')
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
      <button className="btn btn-primary home-btn" onClick={goToHomePage}>Home</button> {/* Added this line */}
      <div className="card p-4" style={{ width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h2 className="text-center mb-4">Login</h2>
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
          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        </form>
        <div className="text-center mt-3">
          <p>New user? <button className="btn btn-link p-0" onClick={register_page}>Register</button></p>
        </div>
      </div>
    </div>
  );
  
}

export default Login;
