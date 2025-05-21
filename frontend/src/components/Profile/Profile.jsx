import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-info">
        <div className="profile-avatar">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-details">
          <h3>{user?.email}</h3>
          <p>Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile; 