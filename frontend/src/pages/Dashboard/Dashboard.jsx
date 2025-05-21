import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import Profile from '../../components/Profile/Profile';
import './Dashboard.css';

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'MMMM yyyy'));
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();
    fetchPets();
  }, [selectedDate]);

  const fetchReminders = async () => {
    try {
      const response = await api.get('/api/reminders');

      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await api.get('/api/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleAddReminder = () => {
    navigate('/add-reminder');
  };

  const handleEditReminder = (id) => {
    navigate(`/edit-reminder/${id}`);
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.delete(`/api/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleCompleteReminder = async (id) => {
    try {
      await api.patch(`/api/reminders/${id}/complete`);
      fetchReminders();
    } catch (error) {
      console.error('Error completing reminder:', error);
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const day = new Date();
      day.setDate(today.getDate() + i);
      days.push({
        date: day,
        isToday: i === 0,
        isSelected: format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      });
    }
    return days;
  };

  const changeDate = (date) => {
    setSelectedDate(date);
  };

  // Filter reminders by timeSlot
  const getRemindersByTimeSlot = (timeSlot) => {
    return reminders.filter(reminder => 
      reminder.timeSlot === timeSlot && 
      format(new Date(reminder.startDateTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  };

  const calendarDays = generateCalendarDays();
  
  return (
    <div className="dashboard">
      <Profile />
      
      <header>
        <h2>daily reminders</h2>
        <a href="#" className="view-all">view all</a>
      </header>
      
      <div className="calendar-section">
        <h3 className="your-streaks">Your streaks</h3>
        <div className="calendar">
          <div className="month">{currentMonth}</div>
          <div className="weekdays">
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
            <div>Su</div>
          </div>
          <div className="days">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`day ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''}`}
                onClick={() => changeDate(day.date)}
              >
                {format(day.date, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reminders-container">
        <div className="timeSlot-section">
          <h3>Morning</h3>
          {getRemindersByTimeSlot('Morning').map(reminder => (
            <div key={reminder._id} className="reminder-card">
              <div className="pet-icon">
                {reminder.pet && pets.find(p => p._id === reminder.pet)?.type === 'Dog' ? '🐕' : '🐈'}
                <span>For {pets.find(p => p._id === reminder.pet)?.name || 'Pet'}</span>
              </div>
              <h4>{reminder.title}</h4>
              <div className="reminder-details">
                <span>At {format(new Date(reminder.startDateTime), 'h:mm a')}</span>
                <span>{reminder.category}</span>
              </div>
              <div className="reminder-actions">
                <button onClick={() => handleCompleteReminder(reminder._id)}>✓</button>
                <button onClick={() => handleEditReminder(reminder._id)}>✎</button>
                <button onClick={() => handleDeleteReminder(reminder._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        <div className="timeSlot-section">
          <h3>Afternoon</h3>
          {getRemindersByTimeSlot('Afternoon').map(reminder => (
            <div key={reminder._id} className="reminder-card">
              <div className="pet-icon">
                {reminder.pet && pets.find(p => p._id === reminder.pet)?.type === 'Dog' ? '🐕' : '🐈'}
                <span>For {pets.find(p => p._id === reminder.pet)?.name || 'Pet'}</span>
              </div>
              <h4>{reminder.title}</h4>
              <div className="reminder-details">
                <span>At {format(new Date(reminder.startDateTime), 'h:mm a')}</span>
                <span>{reminder.category}</span>
              </div>
              <div className="reminder-actions">
                <button onClick={() => handleCompleteReminder(reminder._id)}>✓</button>
                <button onClick={() => handleEditReminder(reminder._id)}>✎</button>
                <button onClick={() => handleDeleteReminder(reminder._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        <div className="timeSlot-section">
          <h3>Evening</h3>
          {getRemindersByTimeSlot('Evening').map(reminder => (
            <div key={reminder._id} className="reminder-card">
              <div className="pet-icon">
                {reminder.pet && pets.find(p => p._id === reminder.pet)?.type === 'Dog' ? '🐕' : '🐈'}
                <span>For {pets.find(p => p._id === reminder.pet)?.name || 'Pet'}</span>
              </div>
              <h4>{reminder.title}</h4>
              <div className="reminder-details">
                <span>At {format(new Date(reminder.startDateTime), 'h:mm a')}</span>
                <span>{reminder.category}</span>
              </div>
              <div className="reminder-actions">
                <button onClick={() => handleCompleteReminder(reminder._id)}>✓</button>
                <button onClick={() => handleEditReminder(reminder._id)}>✎</button>
                <button onClick={() => handleDeleteReminder(reminder._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pending-goals">
        <h3>pending goals</h3>
        {/* List pending goals */}
      </div>

      <div className="completed-goals">
        <h3>completed goals</h3>
        {/* List completed goals */}
      </div>

      <button className="add-button" onClick={handleAddReminder}>+</button>
    </div>
  );
};

export default Dashboard;