// Frontend-facing models (camelCase, clean for UI consumption)

export interface UserModel {
  id?: string
  name: string
  email: string
  role?: 'user' | 'mechanic' | 'admin' | string
  phone?: string
  avatar?: string
  createdAt?: string
  [key: string]: any
}

export interface CarModel {
  id?: string
  make: string
  model: string
  year: number | string
  licensePlate?: string
  vin?: string
  owner?: string | UserModel
  color?: string
  mileage?: number
  [key: string]: any
}

export interface RepairRequestModel {
  id?: string
  car?: string | CarModel
  user?: string | UserModel
  customer?: string | UserModel
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled' | string
  description?: string
  cost?: number
  estimatedCost?: number
  actualCost?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface AppointmentModel {
  id?: string
  date?: string
  time?: string
  status?: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled' | string
  car?: string | CarModel
  user?: string | UserModel
  serviceType?: string
  notes?: string
  [key: string]: any
}
