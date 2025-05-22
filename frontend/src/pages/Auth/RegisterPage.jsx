import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './LoginPage.css';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if passwords match whenever password or confirmPassword changes
  useEffect(() => {
    if (formData.confirmPassword && formData.password === formData.confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [formData.password, formData.confirmPassword]);

  // Check password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    // Simple password strength algorithm
    let strength = 0;
    
    // Length check
    if (formData.password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(formData.password)) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 25;
    
    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 75) {
      setError('Please use a stronger password with uppercase, lowercase, numbers/symbols, and at least 8 characters');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      {registrationSuccess && (
        <div className="registration-success">
          Registration successful! Redirecting to login...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="focus-indicator"></div>
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="focus-indicator"></div>
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formData.password && (
            <div className="password-strength">
              <div 
                className="password-strength-indicator" 
                style={{
                  width: `${passwordStrength}%`,
                  backgroundColor: 
                    passwordStrength < 25 ? '#f44336' : 
                    passwordStrength < 50 ? '#ff9800' : 
                    passwordStrength < 75 ? '#ffeb3b' : 
                    '#4caf50'
                }}
              ></div>
            </div>
          )}
          <div className="focus-indicator"></div>
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {formData.confirmPassword && passwordsMatch && (
            <div className="passwords-match">Passwords match</div>
          )}
          <div className="focus-indicator"></div>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !passwordsMatch || passwordStrength < 75}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;