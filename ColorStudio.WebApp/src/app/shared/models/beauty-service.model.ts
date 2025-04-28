export enum ServiceType {
  NAIL = 'NAIL',
  HAIR = 'HAIR',
  FACE = 'FACE',
  BODY = 'BODY',
  MAKEUP = 'MAKEUP'
}

export interface BeautyService {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  type: ServiceType;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceDetails extends BeautyService {
  averageRating: number;
  totalBookings: number;
  lastBookingDate?: Date;
  requirements: string[];
  benefits: string[];
  preparationNotes: string;
  aftercareInstructions: string;
}

export interface ServiceHistory {
  id?: number;
  serviceId: number;
  customerId: number;
  customerName: string;
  date: Date;
  price: number;
  duration: number;
  notes?: string;
  rating?: number;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 