import { BaseModel } from './base.model';

export interface BeautyService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  categoryId: number;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BeautyServiceHistory extends BaseModel {
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

export enum BeautyServiceCategory {
  Hair = 1,
  Nail = 2,
  Skin = 3,
  Makeup = 4
} 