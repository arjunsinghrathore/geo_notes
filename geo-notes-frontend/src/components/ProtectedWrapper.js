
import { Route, Navigate } from 'react-router-dom';

// function ProtectedRoute({ element, ...rest }) {
//   const token = localStorage.getItem('auth-token');

//   if (!token) {
//     // If the user is not authenticated, redirect to the login page
//     return <Navigate to="/login" />;
//   }

//   // If the user is authenticated, render the protected component
//   return <Route {...rest} element={element} />;
// }

// export default ProtectedRoute;

function ProtectedWrapper({ children }) {
    const token = localStorage.getItem('auth-token');
  
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  }

export default ProtectedWrapper;
  
