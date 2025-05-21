// app.js (entry point)
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes')
const reminderRoutes = require('./routes/reminderRoutes');

const app = express();


connectDB();


app.use(helmet());                  
app.use(express.json());            
app.use(cookieParser());            


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                 
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/reminders', reminderRoutes);
app.get('/',(req,res)=>{
    res.send('welcome to our website')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
