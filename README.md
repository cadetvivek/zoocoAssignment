# 🐾 Zooco - Pet Care Reminder Application

![Zooco Banner](https://via.placeholder.com/1200x300/4A90E2/FFFFFF?text=Zooco+Pet+Care+Application)

## 📋 Overview

Zooco is a comprehensive pet care management application designed to help pet owners stay organized with reminders for essential pet care tasks such as feeding, vet appointments, medication, grooming, and more. With a beautiful, responsive UI featuring animal-themed animations, Zooco makes pet care management both functional and delightful.

## ✨ Features

- **User Authentication** - Secure login and registration system
- **Pet Management** - Add and manage multiple pets with detailed profiles
- **Reminder System** - Create, edit, and track pet care reminders
- **Interactive Dashboard** - Calendar view with animations and reminder cards
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Professional styling with animations and transitions

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router 7
- Axios for API communication
- Date-fns for date handling
- Custom CSS with animations
- Vite build tool

### Backend
- Node.js with Express 5
- MongoDB with Mongoose
- JSON Web Token (JWT) authentication
- bcrypt for password encryption
- Security features (Helmet, CORS)

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zooco.git
   cd zooco
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zooco
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will open in your browser at http://localhost:5173

### Production Build

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

## 📱 Application Screenshots

![Login Page](https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Login+Page)
![Dashboard](https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Dashboard)
![Add Reminder](https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Add+Reminder)
![Pet Profile](https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Pet+Profile)

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Pets
- `GET /api/pets` - Get all pets
- `POST /api/pets` - Add a new pet
- `GET /api/pets/:id` - Get pet by ID
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create a new reminder
- `GET /api/reminders/:id` - Get reminder by ID
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

## 🎨 UI Features

- **Animated Backgrounds** - Animal-themed animations with floating pet silhouettes
- **Interactive Components** - Hover effects and transitions
- **Modern Design** - Card-based layouts with gradient buttons
- **Loading Animations** - Smooth state transitions
- **Responsive Layout** - Adapts to all screen sizes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

- Your Name - Initial work - [YourGithubUsername](https://github.com/yourusername)

---

<p align="center">
  Made with ❤️ for pets and their humans
</p>
