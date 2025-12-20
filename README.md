# 🚗 CarFix - Smart Car Maintenance & Repair Management Platform

<div align="center">

![CarFix](https://img.shields.io/badge/CarFix-v1.0.0-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1-61dafb?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-8.18-green?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-5.1-90c53f?style=for-the-badge)

**A comprehensive full-stack platform connecting car owners with mechanics and service workshops**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference) • [Project Structure](#-project-structure)

</div>

---

## 📋 Overview

**CarFix** is a modern, full-stack application designed to revolutionize how car owners manage their vehicle maintenance and repairs. The platform provides a seamless experience for:

- **Car Owners** - Track vehicles, schedule repairs, find trusted mechanics
- **Mechanics** - Manage job requests, track completed work, build reputation
- **Administrators** - Oversee all activities, manage users and workshops

With real-time notifications, comprehensive dashboards, and a user-friendly interface, CarFix makes car maintenance effortless.

---

## 🎯 Features

### 👥 **User Features**
- ✅ **Vehicle Management** - Add, update, and manage multiple vehicles
- ✅ **Smart Dashboard** - Overview of all vehicles and appointments
- ✅ **Repair Requests** - Create and track repair requests with priority levels
- ✅ **Shop Browsing** - Discover and compare nearby workshops and mechanics
- ✅ **Appointment System** - Schedule and manage repair appointments
- ✅ **Repair History** - Track completed repairs and maintenance records
- ✅ **Reviews & Ratings** - Rate mechanics and workshops
- ✅ **Real-time Notifications** - Instant updates on repair status
- ✅ **User Profile** - Manage personal information and preferences
- ✅ **Shopping Cart** - Purchase automotive accessories

### 🔧 **Mechanic Features**
- ✅ **Dashboard Analytics** - View jobs and performance metrics
- ✅ **Job Management** - Accept/reject repair requests with priority handling
- ✅ **Work Tracking** - Monitor ongoing repairs and completion status
- ✅ **Appointment Management** - Schedule and manage appointments
- ✅ **Completed Work** - Track finished repairs with statistics
- ✅ **Reviews Management** - View customer feedback and ratings
- ✅ **Professional Profile** - Showcase skills and experience
- ✅ **Dark/Light Theme** - Customizable interface with theme toggle
- ✅ **Settings** - Personalize notification preferences

### 👨‍💼 **Admin Features**
- ✅ **Complete Dashboard** - Overview of system statistics
- ✅ **User Management** - Create, view, update, and delete users
- ✅ **Mechanic Verification** - Approve and manage mechanic profiles
- ✅ **Workshop Management** - Oversee all registered workshops
- ✅ **Repair Request Monitoring** - Track all system repairs
- ✅ **Service Management** - Add and manage available services
- ✅ **Booking Management** - View all appointments and bookings
- ✅ **Review Monitoring** - Manage customer feedback
- ✅ **Analytics & Reports** - System-wide performance metrics

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19.1 with Vite
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM 7.8
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Lucide React Icons, React Icons
- **Charts**: Recharts
- **Code Quality**: ESLint

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js 5.1
- **Database**: MongoDB with Mongoose 8.18
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs, bcrypt
- **Middleware**: CORS, Cookie Parser
- **Environment**: Dotenv

### **Development Tools**
- **Build**: Vite, Nodemon
- **Package Manager**: npm
- **Version Control**: Git

---

## 🚀 Installation

### **Prerequisites**
- Node.js (v20.x or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd CarFix
```

### **2. Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo > .env

# Add environment variables
MONGODB_URI=mongodb://localhost:27017/carfix
JWT_SECRET=your_jwt_secret_key_here
PORT=5000

# Start the server
npm start
```

The backend will run on `http://localhost:5000`

### **3. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
# Frontend will connect to backend at http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### **4. Access the Application**
- **User Dashboard**: http://localhost:5173/user/home
- **Mechanic Dashboard**: http://localhost:5173/mechanics/dashboard
- **Admin Dashboard**: http://localhost:5173/admin/dashboard
- **Login Page**: http://localhost:5173/login
- **Sign Up**: http://localhost:5173/sign-in

---

## 📖 Usage Guide

### **For Car Owners**

#### 1. **Register & Login**
```
1. Go to Sign Up page
2. Enter name, email, password
3. Select "user" role
4. Login with credentials
```

#### 2. **Add Your First Vehicle**
```
1. Navigate to "Add Car" from dashboard
2. Fill in vehicle details:
   - Make, Model, Year
   - Color, VIN, License Plate
   - Mileage, Fuel Type, Transmission
3. Submit form
4. Vehicle appears on dashboard
```

#### 3. **Schedule a Repair**
```
1. Go to "Repairs" or "Shop"
2. Browse available mechanics/workshops
3. Create repair request with:
   - Select vehicle
   - Describe issue
   - Set priority level
   - Choose workshop
4. Track repair status in real-time
```

#### 4. **View History & Reviews**
```
1. Check "Completed Repairs" for past work
2. Rate and review mechanics
3. View repair history per vehicle
```

### **For Mechanics**

#### 1. **Setup Profile**
```
1. Register as "mechanic"
2. Complete profile with:
   - Skills and certifications
   - Availability hours
   - Service rates
```

#### 2. **Manage Jobs**
```
1. View incoming job requests in dashboard
2. Accept/reject repair requests
3. Update job status (In Progress → Completed)
4. Track appointment schedules
```

#### 3. **Monitor Performance**
```
1. Check completed work statistics
2. View customer reviews and ratings
3. Analyze revenue and bookings
4. Toggle between dark/light themes
```

### **For Administrators**

#### 1. **Access Admin Panel**
```
1. Register/Login as admin
2. Navigate to admin dashboard
3. Access management features
```

#### 2. **Manage System**
```
1. User Management: View, edit, delete users
2. Workshop Management: Approve and manage workshops
3. Mechanic Verification: Verify mechanic credentials
4. Service Management: Add/edit available services
5. Analytics: Monitor system-wide metrics
```

---

## 🔌 API Reference

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user|mechanic|admin"
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Returns: JWT token in httpOnly cookie
```

### **User Endpoints** (Protected)

#### Get User's Vehicles
```http
GET /cars
Headers: Authorization: Bearer {token}

Response: [
  {
    "_id": "...",
    "make": "Honda",
    "model": "Civic",
    "year": 2022,
    "color": "Silver",
    "vin": "...",
    "licensePlate": "ABC123",
    "mileage": 15000,
    "fuelType": "Hybrid",
    "transmission": "Automatic"
  }
]
```

#### Add Vehicle
```http
POST /cars
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "make": "Honda",
  "model": "Civic",
  "year": 2022,
  "color": "Silver",
  "vin": "JHGCJ5340MA001234",
  "licensePlate": "ABC123",
  "mileage": 15000,
  "fuelType": "Hybrid",
  "transmission": "Automatic"
}
```

#### Update Vehicle
```http
PUT /cars/{carId}
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "mileage": 20000,
  "color": "Blue"
}
```

#### Delete Vehicle
```http
DELETE /cars/{carId}
Headers: Authorization: Bearer {token}
```

### **Repair Requests**

#### Get User's Repairs
```http
GET /repairs
Headers: Authorization: Bearer {token}
```

#### Create Repair Request
```http
POST /repairs
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "carId": "...",
  "title": "Engine Check",
  "description": "Car making unusual noise",
  "priority": "high|medium|low",
  "workshopId": "..."
}
```

#### Get Repair Details
```http
GET /repairs/{repairId}
Headers: Authorization: Bearer {token}
```

#### Update Repair
```http
PUT /repairs/{repairId}
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "status": "completed|in-progress|pending"
}
```

### **Mechanic Endpoints** (Protected)

#### Get Dashboard Stats
```http
GET /mechanics/dashboard
Headers: Authorization: Bearer {token}
```

#### Get Assigned Jobs
```http
GET /mechanics/jobs
Headers: Authorization: Bearer {token}
```

#### Update Job Status
```http
PUT /mechanics/jobs/{jobId}
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "status": "completed|in-progress|pending"
}
```

### **Admin Endpoints** (Protected - Admin Only)

#### Get Dashboard Stats
```http
GET /admin/dashboard
Headers: Authorization: Bearer {token}
```

#### User Management
```http
GET /admin/users              # Get all users
GET /admin/users/{userId}     # Get specific user
PUT /admin/users/{userId}     # Update user
DELETE /admin/users/{userId}  # Delete user
```

#### Workshop Management
```http
GET /admin/workshops
POST /admin/workshops
PUT /admin/workshops/{workshopId}
DELETE /admin/workshops/{workshopId}
```

#### Service Management
```http
GET /admin/services
POST /admin/services
PUT /admin/services/{serviceId}
DELETE /admin/services/{serviceId}
```

---

## 📁 Project Structure

```
CarFix/
├── 📁 backend/
│   ├── 📄 server.js                 # Express app entry point
│   ├── 📄 package.json              # Backend dependencies
│   ├── 📁 middleware/
│   │   └── 📄 auth.js              # JWT authentication
│   ├── 📁 models/                  # Database schemas
│   │   ├── 📄 user.js
│   │   ├── 📄 car.js
│   │   ├── 📄 repairRequest.js
│   │   ├── 📄 order.js
│   │   ├── 📄 review.js
│   │   ├── 📄 service.js
│   │   ├── 📄 workshop.js
│   │   ├── 📄 accessory.js
│   │   ├── 📄 notification.js
│   │   └── 📄 notification.js
│   ├── 📁 routes/                  # API endpoints
│   │   ├── 📄 userRoutes.js
│   │   ├── 📄 carRoutes.js
│   │   ├── 📄 repairRoutes.js
│   │   ├── 📄 mechanicRoutes.js
│   │   ├── 📄 adminRoutes.js
│   │   ├── 📄 workshopRoutes.js
│   │   └── 📄 notificationRoutes.js
│   └── 📁 utils/
│       └── 📄 validators.js        # Input validation
│
├── 📁 frontend/
│   ├── 📄 index.html               # HTML entry point
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 vite.config.js           # Vite configuration
│   ├── 📄 eslint.config.js         # Linting rules
│   ├── 📁 src/
│   │   ├── 📄 main.jsx             # React entry point
│   │   ├── 📄 App.jsx              # Main App component
│   │   ├── 📄 App.css
│   │   ├── 📄 index.css
│   │   ├── 📁 context/             # React Context providers
│   │   │   ├── 📄 AuthContext.jsx
│   │   │   ├── 📄 UserThemeContext.jsx
│   │   │   ├── 📄 AdminThemeContext.jsx
│   │   │   └── 📄 MechanicsThemeContext.jsx
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── 📁 user/
│   │   │   │   ├── 📄 UserLayout.jsx
│   │   │   │   ├── 📁 home/
│   │   │   │   ├── 📁 profile/
│   │   │   │   ├── 📁 addCar/
│   │   │   │   ├── 📁 appointments/
│   │   │   │   ├── 📁 repairs/
│   │   │   │   ├── 📁 completed-repairs/
│   │   │   │   ├── 📁 repair-history/
│   │   │   │   └── 📁 shop/
│   │   │   ├── 📁 Mechanics/
│   │   │   │   ├── 📄 MechanicsLayout.jsx
│   │   │   │   ├── 📄 MechanicsDashboard.jsx
│   │   │   │   ├── 📄 MechanicsProfile.jsx
│   │   │   │   ├── 📄 jobs.jsx
│   │   │   │   ├── 📄 appointments.jsx
│   │   │   │   ├── 📄 completed.jsx
│   │   │   │   ├── 📄 in-progress.jsx
│   │   │   │   ├── 📄 reviews.jsx
│   │   │   │   └── 📄 settings.jsx
│   │   │   ├── 📁 admin/
│   │   │   │   ├── 📄 admin.jsx
│   │   │   │   ├── 📄 AdminLayout.jsx
│   │   │   │   ├── 📄 dashboard.jsx
│   │   │   │   ├── 📄 users.jsx
│   │   │   │   ├── 📄 workshops.jsx
│   │   │   │   ├── 📄 mechanics.jsx
│   │   │   │   ├── 📄 services.jsx
│   │   │   │   ├── 📄 reviews.jsx
│   │   │   │   ├── 📄 bookings.jsx
│   │   │   │   ├── 📄 reports.jsx
│   │   │   │   ├── 📄 settings.jsx
│   │   │   │   └── 📄 userDetail.jsx
│   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 login/
│   │   │   │   └── 📁 sign-in/
│   │   │   └── 📁 Home/
│   │   ├── 📁 components/          # Reusable components
│   │   │   ├── 📄 ProtectedRoute.jsx
│   │   │   ├── 📁 shared/
│   │   │   │   ├── 📄 NavBar.jsx
│   │   │   │   ├── 📄 Footer.jsx
│   │   │   │   ├── 📄 CartModal.jsx
│   │   │   │   ├── 📄 JobDetailsModal.jsx
│   │   │   │   └── 📄 HeroSection.jsx
│   │   │   ├── 📁 hero-sec/
│   │   │   ├── 📁 nav-bar/
│   │   │   └── 📁 footer/
│   │   ├── 📁 services/            # API services
│   │   │   ├── 📄 api.js           # Axios instance
│   │   │   ├── 📄 BaseApi.js       # Base API class
│   │   │   ├── 📄 userService.js
│   │   │   ├── 📄 adminService.js
│   │   │   ├── 📄 mechanicService.js
│   │   │   └── 📄 appointmentService.js
│   │   ├── 📁 assets/              # Static assets
│   │   └── 📁 public/              # Public files
│
├── 📄 README.md                    # Project documentation
├── 📄 INTEGRATION_SUMMARY.md       # Integration notes
├── 📄 PROFILE_FEATURES_GUIDE.md    # User profile features
└── 📄 MECHANICS_THEME_IMPLEMENTATION.md  # Theme details
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **CORS Protection** - Cross-origin request handling
- ✅ **Role-Based Access** - User, Mechanic, and Admin roles
- ✅ **Protected Routes** - Frontend route protection
- ✅ **HTTP-Only Cookies** - Secure token storage
- ✅ **Input Validation** - Server-side validation

---

## 🎨 UI/UX Features

### **Theme Support**
- 🌓 **Dark/Light Modes** - Available on mechanic and admin dashboards
- 🎨 **Tailwind CSS** - Modern utility-first styling
- 📱 **Responsive Design** - Mobile, tablet, and desktop optimized
- ♿ **Accessibility** - WCAG compliant UI components

### **User Experience**
- 🔔 **Real-time Notifications** - Instant status updates
- 📊 **Interactive Dashboards** - Charts and analytics using Recharts
- 🎯 **Intuitive Navigation** - Role-based navigation menus
- ⚡ **Fast Performance** - Vite for optimized bundling

---

## 🚦 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install backend dependencies
- [ ] Configure MongoDB connection
- [ ] Start backend server
- [ ] Install frontend dependencies
- [ ] Start frontend development server
- [ ] Register a new account
- [ ] Add your first vehicle
- [ ] Create a repair request
- [ ] Browse mechanics and workshops

---

## 📚 Documentation

- [API Documentation](./backend/API_DOCUMENTATION.md) - Detailed endpoint reference
- [Integration Guide](./backend/INTEGRATION_GUIDE.md) - Integration details
- [Implementation Status](./backend/IMPLEMENTATION_COMPLETE.md) - Current features
- [Profile Features](./PROFILE_FEATURES_GUIDE.md) - User profile guide
- [Mechanics Theme](./MECHANICS_THEME_IMPLEMENTATION.md) - Theme implementation details

---

## 🤝 Contributing

We welcome contributions! To get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### **Code Style Guidelines**
- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Add comments for complex logic
- Write meaningful commit messages

---

## 🐛 Troubleshooting

### **Backend won't start**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <PID> /F

# Restart backend
npm start
```

### **Frontend connection issues**
```bash
# Ensure backend is running on port 5000
# Check network requests in browser DevTools
# Verify API endpoints in src/services/api.js
```

### **MongoDB connection error**
```bash
# Check MongoDB is running
# Verify connection string in .env
# Test connection with MongoDB Compass
```

---

## 📜 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 💡 Future Enhancements

- 📍 **GPS Integration** - Find nearby mechanics
- 💳 **Payment Gateway** - Integrated payment processing
- 📧 **Email Notifications** - Send repair updates via email
- 📱 **Mobile App** - React Native mobile application
- 🤖 **AI Chatbot** - Smart customer support
- 🔍 **Advanced Search** - Filter and search mechanics
- ⭐ **Recommendation System** - Suggest mechanics based on history

---

## 📞 Support & Contact

For support, questions, or feedback:

- 📧 **Email**: support@carfix.com
- 🐛 **Issue Tracker**: GitHub Issues
- 💬 **Discussion Forum**: Community discussions
- 📱 **Phone**: Contact support team

---

## 🙌 Acknowledgments

- Built with modern web technologies
- Inspired by leading automotive platforms
- Community feedback and contributions
- Open-source libraries and frameworks

---

<div align="center">

**Made with ❤️ by AHMED**

⭐ Star us on GitHub if you found this helpful!

</div>
