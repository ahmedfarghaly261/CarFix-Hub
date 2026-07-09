// DTOs: Backend response shapes (snake_case/mixed — mirrors exactly what the API returns)

export interface UserResponseDto {
  _id?: string
  id?: string
  name: string
  email: string
  role?: string
  phone?: string
  avatar?: string
  createdAt?: string
  [key: string]: any
}

export interface CarResponseDto {
  _id?: string
  id?: string
  make: string
  model: string
  year: number | string
  licensePlate?: string
  vin?: string
  owner?: string | UserResponseDto
  color?: string
  mileage?: number
  [key: string]: any
}

export interface RepairRequestResponseDto {
  _id?: string
  id?: string
  car?: string | CarResponseDto
  user?: string | UserResponseDto
  customer?: string | UserResponseDto
  status?: string
  description?: string
  cost?: number
  estimatedCost?: number
  actualCost?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface AppointmentResponseDto {
  _id?: string
  id?: string
  date?: string
  time?: string
  status?: string
  car?: string | CarResponseDto
  user?: string | UserResponseDto
  serviceType?: string
  notes?: string
  [key: string]: any
}

// Request DTOs
export interface CreateCarRequestDto {
  make: string
  model: string
  year: number | string
  licensePlate?: string
  vin?: string
  color?: string
  mileage?: number
}

export interface CreateRepairRequestDto {
  car?: string
  description?: string
  services?: string[]
  notes?: string
}
