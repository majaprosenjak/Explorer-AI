import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import RoutesPage from './Components/RoutesPage';
import UsersPage from './Components/UsersPage';
import RouteInput from './Components/RouteInput';
import Login from './Components/Login';
import { auth } from './firebaseConfig'; 

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        {user ? (
          <>
            <Navbar />
            <Routes>
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/routeInput" element={<RouteInput />} />
              <Route path="*" element={<Navigate to="/routes" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
