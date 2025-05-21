import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import AddReminder from './pages/AddReminder/AddReminder';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AuthContext from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/me');
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Not authenticated', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    if (userData.accessToken) {
      localStorage.setItem('token', userData.accessToken);
    }
    if (userData.user) {
      setUser(userData.user);
    } else {
      api.get('/api/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
        });
    }
  };

  const logout = () => {
    api.post('/api/auth/logout')
      .then(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .catch(err => console.error('Logout error:', err));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/" element={<PrivateRoute user={user}><Dashboard /></PrivateRoute>} />
            <Route path="/add-reminder" element={<PrivateRoute user={user}><AddReminder /></PrivateRoute>} />
            <Route path="/edit-reminder/:id" element={<PrivateRoute user={user}><AddReminder /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;