import { BaseModel } from './base.model';

export interface NailService extends BaseModel {
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  categoryId: number;
  imageUrl?: string;
}

export interface NailServiceHistory extends BaseModel {
  serviceId: number;
  customerId: number;
  customerName: string;
  serviceDate: Date;
  price: number;
  notes?: string;
  rating?: number;
  beforeImageUrl?: string;
  afterImageUrl?: string;
} 