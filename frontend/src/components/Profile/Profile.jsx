import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleProfile = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`profile-section ${isOpen ? 'open' : ''}`}>
      <div className="profile-avatar" onClick={toggleProfile}>
        {user?.email?.charAt(0).toUpperCase()}
      </div>

      {isOpen && (
        <div className="profile-info">
          <div className="profile-details">
            <h3>{user?.email}</h3>
            <p>Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
