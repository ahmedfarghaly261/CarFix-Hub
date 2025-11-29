# CarFix Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require:
- JWT token in cookie: `token`
- User must have appropriate role

## Roles
- **user**: Regular customers
- **mechanic**: Service mechanics
- **admin**: System administrators

---

## PUBLIC ENDPOINTS

### User Authentication
**POST** `/users/register`
- Register new user
- Body: `{ name, email, password, role }`

**POST** `/users/login`
- Login user
- Body: `{ email, password }`
- Returns: JWT token in cookie

---

## USER ENDPOINTS (Protected - `/api/users/*`)

### Cars
**GET** `/cars`
- Get user's cars
- Auth: User, Admin

**POST** `/cars`
- Add new car
- Body: `{ make, model, year, vin, licensePlate }`
- Auth: User

**GET** `/cars/:id`
- Get specific car details
- Auth: Car owner, Admin

**PUT** `/cars/:id`
- Update car
- Body: `{ make, model, year, vin, licensePlate }`
- Auth: Car owner

**DELETE** `/cars/:id`
- Delete car
- Auth: Car owner

### Repair Requests
**GET** `/repairs`
- Get user's repair requests
- Auth: User sees own, Admin sees all

**POST** `/repairs`
- Create repair request
- Body: `{ carId, title, description, priority, workshopId }`
- Auth: User

**GET** `/repairs/:id`
- Get repair request details
- Auth: Request owner, Assigned mechanic, Admin

**PUT** `/repairs/:id`
- Update repair request
- Auth: Request owner, Admin

---

## ADMIN ENDPOINTS (Protected - `/api/admin/*`)

**Requires:** `role === 'admin'`

### Dashboard
**GET** `/dashboard`
- Get admin dashboard stats
- Returns: User counts, repair stats, etc.

### Users Management
**GET** `/users`
- List all regular users

**GET** `/users/:id`
- Get specific user

**PUT** `/users/:id`
- Update user
- Body: Any user fields

**DELETE** `/users/:id`
- Delete user

### Mechanics Management
**GET** `/mechanics`
- List all mechanics

**GET** `/mechanics/:id`
- Get specific mechanic

**POST** `/mechanics`
- Create new mechanic
- Body: `{ name, email, password, phone, specializations, workHours }`

**PUT** `/mechanics/:id`
- Update mechanic

**DELETE** `/mechanics/:id`
- Delete mechanic

### Bookings/Repair Requests
**GET** `/bookings`
- List all repair requests

**GET** `/bookings/:id`
- Get repair request details

**PUT** `/bookings/:id`
- Update repair request status
- Body: `{ status, priority, workshopId }`

### Services
**GET** `/services`
- List available services

### Reviews
**GET** `/reviews`
- Get all mechanics with ratings

### Reports
**GET** `/reports`
- Get system reports (revenue, stats by status/priority)

---

## MECHANIC ENDPOINTS (Protected - `/api/mechanics/*`)

**Requires:** `role === 'mechanic'`

### Dashboard
**GET** `/dashboard`
- Get mechanic dashboard stats
- Returns: Total jobs, pending, in-progress, completed

### Jobs
**GET** `/jobs`
- List all assigned jobs

**GET** `/jobs/:id`
- Get specific job details

**PUT** `/jobs/:id/start`
- Start working on a job
- Changes status to 'in-progress'
- Creates notification for customer

**POST** `/jobs/:id/update`
- Send work update to customer
- Body: `{ message }`
- Creates notification for customer

**PUT** `/jobs/:id/complete`
- Mark job as completed
- Body: `{ notes, cost }`
- Updates mechanic stats
- Creates notification for customer

### Appointments
**GET** `/appointments`
- List pending/assigned appointments

### In-Progress Jobs
**GET** `/in-progress`
- List jobs currently being worked on

### Completed Jobs
**GET** `/completed`
- List completed jobs
- Sorted by completion date (newest first)

### Reviews
**GET** `/reviews`
- Get mechanic's rating and job stats

### Profile
**GET** `/profile`
- Get own profile (without password)

**PUT** `/profile`
- Update profile
- Body: `{ name, phone, bio, address, city, specializations }`

### Settings
**PUT** `/settings`
- Update work settings
- Body: `{ workHours, specializations }`
- workHours format: `{ monday: {start, end}, tuesday: {start, end}, ... }`

---

## DATA MODELS

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: enum['user', 'mechanic', 'admin'],
  phone: String,
  
  // Mechanic fields
  specializations: [String],
  workHours: {
    monday: { start: String, end: String },
    // ... other days
  },
  workshopId: ObjectId,
  rating: Number (0-5),
  totalJobs: Number,
  completedJobs: Number,
  
  // Profile
  profileImage: String,
  bio: String,
  address: String,
  city: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Car
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  make: String,
  model: String,
  year: Number,
  vin: String,
  licensePlate: String,
  mileage: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### RepairRequest
```javascript
{
  _id: ObjectId,
  carId: ObjectId (ref: Car),
  userId: ObjectId (ref: User),
  workshopId: ObjectId (ref: Workshop),
  title: String,
  description: String,
  status: enum['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
  priority: enum['low', 'medium', 'high'],
  totalCost: Number,
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String,
  title: String,
  message: String,
  relatedId: ObjectId,
  read: Boolean (default: false),
  createdAt: Date
}
```

---

## Error Responses

### 400 Bad Request
```json
{ "message": "Validation error or invalid data" }
```

### 401 Unauthorized
```json
{ "message": "Not authorized" }
```

### 403 Forbidden
```json
{ "message": "Admin access required" }
```

### 404 Not Found
```json
{ "message": "Resource not found" }
```

### 500 Internal Server Error
```json
{ "message": "Something went wrong!" }
```

---

## Frontend Integration Notes

### User Flow
1. Register/Login → Get JWT cookie
2. Add cars → POST `/api/users/cars`
3. Create repair request → POST `/api/repairs`
4. View repairs → GET `/api/repairs`

### Admin Flow
1. Login (role: 'admin')
2. View dashboard → GET `/api/admin/dashboard`
3. Manage users → GET/PUT/DELETE `/api/admin/users`
4. Manage mechanics → GET/POST/PUT/DELETE `/api/admin/mechanics`
5. View bookings → GET `/api/admin/bookings`
6. View reports → GET `/api/admin/reports`

### Mechanic Flow
1. Login (role: 'mechanic')
2. View dashboard → GET `/api/mechanics/dashboard`
3. View assigned jobs → GET `/api/mechanics/jobs`
4. Start job → PUT `/api/mechanics/jobs/:id/start`
5. Send updates → POST `/api/mechanics/jobs/:id/update`
6. Complete job → PUT `/api/mechanics/jobs/:id/complete`
7. View completed jobs → GET `/api/mechanics/completed`
