import { BaseModel } from './base.model';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  name?: string; // computed from firstName + lastName
  email: string;
  phone: string;
  birthDate: Date;
  gender: string;
  address: string;
  profileImageUrl?: string;
  membershipLevel: string;
  isVerified: boolean;
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: Date;
  isActive: boolean;
  skinType: string;
  hairType: string;
  allergies?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerAppointment {
  id: number;
  customerId: number;
  serviceName: string;
  serviceId: number;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  staffId: number;
  staffName: string;
  price: number;
}

export interface CustomerHistory {
  id: number;
  customerId: number;
  type: 'APPOINTMENT' | 'PAYMENT' | 'SERVICE' | 'PURCHASE' | 'MEMBERSHIP_CHANGE' | 'NOTE';
  date: Date;
  description: string;
  amount?: number;
  staffId?: number;
  staffName?: string;
  relatedEntityId?: number;
  relatedEntityType?: 'SERVICE' | 'PAYMENT' | 'MEMBERSHIP' | 'CANCELLATION';
} 