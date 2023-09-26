// import logo from './logo.svg';
// import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Register from './components/Register';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard'; // Import the Dashboard component
// import ProtectedRoute from './components/ProtectedRoute'; // Import the component


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <ProtectedRoute path="/dashboard" element={<Dashboard />} /> {/* Use ProtectedRoute here */}
//         {/* Add more routes as needed */}
//         <Route path="/notes" />
//         <Route path="/notes/:id" />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Importing App.css to ensure styles are applied
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedWrapper from './components/ProtectedWrapper';
import HomePage from './components/HomePage';  // Importing HomePage component

function App() {
  return (
    <div className="App">  {/* Added this wrapper div */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* HomePage route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedWrapper>
              <Dashboard />
            </ProtectedWrapper>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;




