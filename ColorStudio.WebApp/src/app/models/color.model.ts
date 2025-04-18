import { BaseModel } from './base.model';

export enum ColorCategory {
  hair = 'hair',
  nails = 'nails',
  skin = 'skin',
  makeup = 'makeup'
}

export interface Color extends BaseModel {
  name: string;
  code: string;
  hexCode: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  description?: string;
  isActive: boolean;
  inStock: boolean;
  popularity: number;
  imageUrl?: string;
}

export interface ColorCategoryModel {
  id: number;
  name: string;
  description?: string;
}

export interface ColorBrand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
} 