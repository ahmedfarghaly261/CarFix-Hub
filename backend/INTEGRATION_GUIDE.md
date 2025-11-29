# Frontend-Backend Integration Guide

## API Base URL Setup

Add to your frontend `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

Or in your code:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## Key API Endpoints for Frontend Pages

### HOME PAGE
```javascript
// No authentication required
GET /users/register  // Sign-up page
GET /users/login     // Login page
```

### USER DASHBOARD
```javascript
// After login
GET /users/cars                  // My Cars page
GET /repairs                     // Appointments page
POST /repairs                    // Create repair request
GET /repairs/:id                 // View repair details
GET /notifications               // Get notifications
```

### USER PROFILE
```javascript
GET /users/profile               // View profile
PUT /users/profile               // Update profile
GET /users/cars                  // Manage cars
POST /users/cars                 // Add car
DELETE /users/cars/:id           // Delete car
```

### ADMIN DASHBOARD
```javascript
GET /admin/dashboard             // Admin Dashboard
GET /admin/users                 // Users list
GET /admin/mechanics             // Mechanics list
POST /admin/mechanics            // Add mechanic
GET /admin/bookings              // All repair requests
GET /admin/reports               // System reports
GET /admin/reviews               // Ratings & reviews
GET /admin/services              // Services list
```

### ADMIN USERS PAGE
```javascript
GET /admin/users                 // List all users
GET /admin/users/:id             // Get user details
PUT /admin/users/:id             // Update user
DELETE /admin/users/:id          // Delete user
```

### ADMIN MECHANICS PAGE
```javascript
GET /admin/mechanics             // List all mechanics
GET /admin/mechanics/:id         // Get mechanic details
POST /admin/mechanics            // Create mechanic
PUT /admin/mechanics/:id         // Update mechanic
DELETE /admin/mechanics/:id      // Delete mechanic
```

### ADMIN BOOKINGS PAGE
```javascript
GET /admin/bookings              // All bookings
GET /admin/bookings/:id          // Booking details
PUT /admin/bookings/:id          // Update booking
```

### MECHANIC DASHBOARD
```javascript
GET /mechanics/dashboard         // Dashboard stats
GET /mechanics/jobs              // All jobs
GET /mechanics/jobs/:id          // Job details (opens modal)
PUT /mechanics/jobs/:id/start    // Start job
POST /mechanics/jobs/:id/update  // Send update
PUT /mechanics/jobs/:id/complete // Complete job
```

### MECHANIC JOBS PAGE
```javascript
GET /mechanics/jobs              // List all jobs
GET /mechanics/jobs/:id          // Job details
```

### MECHANIC APPOINTMENTS PAGE
```javascript
GET /mechanics/appointments      // Pending appointments
```

### MECHANIC IN-PROGRESS PAGE
```javascript
GET /mechanics/in-progress       // Currently working jobs
PUT /mechanics/jobs/:id/complete // Mark complete
```

### MECHANIC COMPLETED PAGE
```javascript
GET /mechanics/completed         // All completed jobs
```

### MECHANIC REVIEWS PAGE
```javascript
GET /mechanics/reviews           // Get mechanic ratings
```

### MECHANIC PROFILE PAGE
```javascript
GET /mechanics/profile           // View profile
PUT /mechanics/profile           // Update profile
```

### MECHANIC SETTINGS PAGE
```javascript
GET /mechanics/profile           // Get current settings
PUT /mechanics/settings          // Update settings
```

---

## Authentication Flow

### Login/Register
```javascript
// Register
POST /users/register
Body: {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "user" // or "mechanic"
}
// Response: JWT token set in cookie

// Login
POST /users/login
Body: {
  email: "john@example.com",
  password: "password123"
}
// Response: JWT token set in cookie
```

### Token Management
- JWT is stored in `httpOnly` cookie
- Automatically sent with all protected requests
- No manual token handling needed in axios/fetch

---

## Sample Axios Setup

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // Important: Send cookies with requests
});

// User cars example
export const getUserCars = async () => {
  try {
    const response = await API.get('/users/cars');
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Create repair request
export const createRepair = async (repairData) => {
  try {
    const response = await API.post('/repairs', repairData);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Mechanic start job
export const startJob = async (jobId) => {
  try {
    const response = await API.put(`/mechanics/jobs/${jobId}/start`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};
```

---

## Response Format

### Success
```javascript
{
  data: { /* resource data */ }
}
```

### Error
```javascript
{
  message: "Error description"
}
```

---

## Database Relationships

```
User (role: 'user')
├── Cars (userId)
│   ├── RepairRequests (carId)
│   │   ├── Notifications (relatedId)
│   │   └── Workshop (workshopId)
│   │       └── User (role: 'mechanic')

User (role: 'admin')
└── Can manage all above

User (role: 'mechanic')
├── Workshop (workshopId)
├── AssignedRepairRequests (workshopId)
└── Ratings & Reviews
```

---

## Status Flows

### Repair Request Status
```
pending → assigned → in-progress → completed
                  ↓
              cancelled
```

### Priority Levels
- `low`
- `medium`
- `high`

### Notification Types
- `job_assigned`
- `job_started`
- `job_update`
- `job_completed`
- `repair_request_created`

---

## Common Issues & Solutions

### CORS Error
**Problem**: `Access to XMLHttpRequest blocked by CORS`
**Solution**: 
- Ensure `withCredentials: true` in axios
- Backend CORS is already configured for `http://localhost:5173`

### 401 Unauthorized
**Problem**: `Not authorized` on protected routes
**Solution**:
- User must be logged in
- Check cookie is being sent
- JWT might be expired (clear and re-login)

### 403 Forbidden
**Problem**: `Admin access required`
**Solution**:
- User must have correct role
- Admin trying to access mechanic endpoint?
- Check user role matches required role

### Notification Not Sending
**Problem**: Updates not showing to users/mechanics
**Solution**:
- Check notification endpoint: `/api/notifications`
- Ensure userId is correct when creating notification
- Check notification status (read/unread) filtering

---

## Testing Endpoints with Postman

1. **Register Test User**
   ```
   POST http://localhost:5000/api/users/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "role": "user"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/users/login
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Add Car**
   ```
   POST http://localhost:5000/api/users/cars
   Header: Cookie: (token from login)
   Body: {
     "make": "Toyota",
     "model": "Camry",
     "year": 2020,
     "vin": "ABC123",
     "licensePlate": "XYZ-789"
   }
   ```

4. **Get Mechanics (Admin)**
   ```
   GET http://localhost:5000/api/admin/mechanics
   Header: Cookie: (admin token)
   ```

---

## Next Steps

1. Update frontend API service files
2. Configure axios with baseURL and withCredentials
3. Test each endpoint with sample data
4. Implement error handling and loading states
5. Connect UI components to API calls
6. Test full user flow (register → add car → create repair)
