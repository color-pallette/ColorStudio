import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../services/base.service';
import { Color, ColorCategory } from '../../models/color.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService extends BaseService {
  protected override apiUrl = `${environment.apiUrl}/colors`;
  private mockColors: Color[] = [];
  private mockId = 1;

  constructor(http: HttpClient) {
    super(http);
    // Initialize mock data
    this.mockColors = [
      {
        id: this.mockId++,
        name: 'رنگ موی قهوه‌ای تیره',
        code: '3B2F2F',
        hexCode: '#3B2F2F',
        brandId: 1,
        brandName: 'لورال',
        categoryId: 1,
        categoryName: ColorCategory.hair,
        description: 'رنگ موی قهوه‌ای تیره مناسب برای موهای طبیعی',
        isActive: true,
        inStock: true,
        popularity: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  getColors(category?: ColorCategory | null): Observable<Color[]> {
    // For development, return mock data
    if (!environment.production) {
      const filteredColors = category
        ? this.mockColors.filter(c => c.categoryName === category)
        : this.mockColors;
      return of(filteredColors).pipe(delay(500));
    }
    
    const url = category ? `${this.apiUrl}?category=${category}` : this.apiUrl;
    return this.get<Color[]>(url);
  }

  getColor(id: number): Observable<Color> {
    // For development, return mock data
    if (!environment.production) {
      const color = this.mockColors.find(c => c.id === id);
      if (color) {
        return of(color).pipe(delay(500));
      }
      throw new Error('Color not found');
    }

    return this.get<Color>(`${this.apiUrl}/${id}`);
  }

  createColor(color: Color): Observable<Color> {
    // For development, save to mock data
    if (!environment.production) {
      const newColor = {
        ...color,
        id: this.mockId++,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.mockColors.push(newColor);
      return of(newColor).pipe(delay(500));
    }

    return this.post<Color>(this.apiUrl, color);
  }

  updateColor(id: number, color: Color): Observable<Color> {
    // For development, update mock data
    if (!environment.production) {
      const index = this.mockColors.findIndex(c => c.id === id);
      if (index !== -1) {
        const updatedColor = {
          ...color,
          updatedAt: new Date()
        };
        this.mockColors[index] = updatedColor;
        return of(updatedColor).pipe(delay(500));
      }
      throw new Error('Color not found');
    }

    return this.put<Color>(`${this.apiUrl}/${id}`, color);
  }

  deleteColor(id: number): Observable<void> {
    // For development, delete from mock data
    if (!environment.production) {
      const index = this.mockColors.findIndex(c => c.id === id);
      if (index !== -1) {
        this.mockColors.splice(index, 1);
        return of(undefined).pipe(delay(500));
      }
      throw new Error('Color not found');
    }

    return this.delete<void>(`${this.apiUrl}/${id}`);
  }

  getColorByCode(code: string): Observable<Color> {
    return this.get<Color>(`${this.apiUrl}/code/${code}`);
  }

  getColorsByBrand(brandId: number): Observable<Color[]> {
    return this.get<Color[]>(`${this.apiUrl}/brand/${brandId}`);
  }

  uploadImage(file: File): Observable<string> {
    // For development, return a mock URL
    if (!environment.production) {
      return of(`/assets/images/colors/mock-${Date.now()}.jpg`).pipe(delay(1000));
    }

    const formData = new FormData();
    formData.append('image', file);
    return this.post<{ url: string }>(`${this.apiUrl}/upload`, formData)
      .pipe(map(response => response.url));
  }
} 