export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: 'user' | 'mechanic' | 'admin' | string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Car {
  _id?: string;
  id?: string;
  make: string;
  model: string;
  year: number | string;
  licensePlate?: string;
  vin?: string;
  owner?: string | User;
  color?: string;
  mileage?: number;
  [key: string]: any;
}

export interface ServiceItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  duration?: number;
  [key: string]: any;
}

export interface RepairRequest {
  _id?: string;
  id?: string;
  car?: string | Car;
  user?: string | User;
  customer?: string | User;
  mechanic?: string | Mechanic;
  workshop?: string | Workshop;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled' | string;
  description?: string;
  services?: ServiceItem[] | string[];
  cost?: number;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Appointment {
  _id?: string;
  id?: string;
  date?: string;
  time?: string;
  status?: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled' | string;
  car?: string | Car;
  user?: string | User;
  customer?: string | User;
  mechanic?: string | Mechanic;
  serviceType?: string;
  notes?: string;
  [key: string]: any;
}

export interface Mechanic {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  specialty?: string | string[];
  rating?: number;
  experience?: number | string;
  status?: 'available' | 'busy' | 'offline' | string;
  workshop?: string | Workshop;
  avatar?: string;
  [key: string]: any;
}

export interface Workshop {
  _id?: string;
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  rating?: number;
  mechanics?: Mechanic[] | string[];
  services?: ServiceItem[] | string[];
  [key: string]: any;
}

export interface NotificationItem {
  _id?: string;
  id?: string;
  title?: string;
  message: string;
  read?: boolean;
  type?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface WorkReport {
  _id?: string;
  id?: string;
  jobId?: string;
  description?: string;
  hoursWorked?: number;
  partsUsed?: { name: string; cost: number; quantity?: number }[];
  totalCost?: number;
  administrativeExpenses?: number;
  billingAmount?: number;
  createdAt?: string;
  [key: string]: any;
}
