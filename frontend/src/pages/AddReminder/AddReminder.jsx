// src/pages/AddReminder/AddReminder.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../services/api';
import './AddReminder.css';

const AddReminder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    startDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    frequency: 'Everyday',
    category: 'feeding',
    timeSlot: 'Morning',
    pet: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPets();
    if (id) {
      fetchReminder(id);
    }
  }, [id]);

  const fetchPets = async () => {
    try {
      const response = await api.get('/api/pets');
      setPets(response.data);
      if (response.data.length > 0 && !formData.pet) {
        setFormData(prev => ({ ...prev, pet: response.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to load pets. Please try again.');
    }
  };

  const fetchReminder = async (reminderId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reminders/${reminderId}`);
      const reminder = response.data;
      
      setFormData({
        title: reminder.title,
        notes: reminder.notes || '',
        startDateTime: format(new Date(reminder.startDateTime), "yyyy-MM-dd'T'HH:mm"),
        frequency: reminder.frequency,
        category: reminder.category,
        timeSlot: reminder.timeSlot,
        pet: reminder.pet
      });
    } catch (error) {
      console.error('Error fetching reminder:', error);
      setError('Failed to load reminder details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    
    try {
      setLoading(true);
      
      if (id) {
        await api.put(`/api/reminders/${id}`, formData);
      } else {
        await api.post('/api/reminders', formData);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving reminder:', error);
      setError('Failed to save reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="add-reminder">
      <div className="form-header">
        <button className="back-button" onClick={handleCancel}>←</button>
        <h2>{id ? 'Edit Reminder' : 'Add Reminder'}</h2>
        <button className="save-button" onClick={handleSubmit}>Save</button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-section">
          <div className="form-group">
            <label>Select Pet</label>
            <div className="select-wrapper">
              <select 
                name="pet" 
                value={formData.pet} 
                onChange={handleChange}
                required
              >
                <option value="">Select a pet</option>
                {pets.map(pet => (
                  <option key={pet._id} value={pet._id}>
                    {pet.type === 'Dog' ? '🐕' : '🐈'} {pet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Select Category</label>
            <div className="select-wrapper">
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                required
              >
                <option value="feeding">Feeding</option>
                <option value="medication">Medication</option>
                <option value="grooming">Grooming</option>
                <option value="exercise">Exercise</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Reminder Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Set a reminder for..."
            required
          />
        </div>

        <div className="form-group">
          <label>Add Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Type here..."
            rows="3"
          ></textarea>
        </div>

        <div className="form-section form-settings">
          <h3>Reminder Settings</h3>
          
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDateTime.split('T')[0]}
              onChange={(e) => {
                const newDateTime = `${e.target.value}T${formData.startDateTime.split('T')[1]}`;
                setFormData(prev => ({ ...prev, startDateTime: newDateTime }));
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Reminder Time</label>
            <input
              type="time"
              name="reminderTime"
              value={formData.startDateTime.split('T')[1]}
              onChange={(e) => {
                const newDateTime = `${formData.startDateTime.split('T')[0]}T${e.target.value}`;
                setFormData(prev => ({ ...prev, startDateTime: newDateTime }));
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Reminder Frequency</label>
            <div className="select-wrapper">
              <select 
                name="frequency" 
                value={formData.frequency} 
                onChange={handleChange}
                required
              >
                <option value="Everyday">Everyday</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <div className="select-wrapper">
              <select 
                name="timeSlot" 
                value={formData.timeSlot} 
                onChange={handleChange}
                required
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddReminder;