// Admin module frontend models

export interface MechanicModel {
  id?: string
  name: string
  email?: string
  phone?: string
  specialty?: string | string[]
  rating?: number
  experience?: number | string
  status?: 'available' | 'busy' | 'offline' | string
  workshop?: string | WorkshopModel
  avatar?: string
  [key: string]: any
}

export interface WorkshopModel {
  id?: string
  name: string
  address?: string
  phone?: string
  email?: string
  rating?: number
  mechanics?: MechanicModel[] | string[]
  services?: ServiceItemModel[] | string[]
  [key: string]: any
}

export interface ServiceItemModel {
  id?: string
  name: string
  price: number
  description?: string
  category?: string
  duration?: number
  [key: string]: any
}

export interface NotificationItemModel {
  id?: string
  title?: string
  message: string
  read?: boolean
  type?: string
  createdAt?: string
  [key: string]: any
}

export interface WorkReportModel {
  id?: string
  jobId?: string
  description?: string
  hoursWorked?: number
  partsUsed?: { name: string; cost: number; quantity?: number }[]
  totalCost?: number
  administrativeExpenses?: number
  billingAmount?: number
  createdAt?: string
  [key: string]: any
}
