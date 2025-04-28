import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/services/base.service';
import { BeautyService, ServiceType, ServiceDetails, ServiceHistory } from '../../shared/models/beauty-service.model';

@Injectable({
  providedIn: 'root'
})
export class BeautyServiceService extends BaseService {
  protected override apiUrl = `${environment.apiUrl}/beauty-services`;
  private mockServices: BeautyService[] = [];
  private mockId = 1;

  constructor(http: HttpClient) {
    super(http);
    // Initialize mock data
    this.mockServices = [
      {
        id: this.mockId++,
        name: 'رنگ مو',
        description: 'رنگ کردن مو با استفاده از محصولات با کیفیت',
        price: 2500000,
        duration: 120,
        type: ServiceType.HAIR,
        isActive: true,
        imageUrl: '/assets/images/services/hair-color.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      } as BeautyService,
      {
        id: this.mockId++,
        name: 'مانیکور',
        description: 'مانیکور حرفه‌ای با استفاده از محصولات درجه یک',
        price: 1500000,
        duration: 60,
        type: ServiceType.NAIL,
        isActive: true,
        imageUrl: '/assets/images/services/manicure.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      } as BeautyService
    ];
  }

  getServices(type?: ServiceType): Observable<BeautyService[]> {
    // For development, return mock data
    if (!environment.production) {
      const filteredServices = type
        ? this.mockServices.filter(s => s.type === type)
        : this.mockServices;
      return of(filteredServices).pipe(delay(500));
    }
    
    const url = type ? `${this.apiUrl}?type=${type}` : this.apiUrl;
    return this.get<BeautyService[]>(url);
  }

  getService(id: number): Observable<ServiceDetails> {
    // For development, return mock data
    if (!environment.production) {
      const service = this.mockServices.find(s => s.id === id);
      if (service) {
        return of(service as ServiceDetails).pipe(delay(500));
      }
      throw new Error('Service not found');
    }

    return this.get<ServiceDetails>(`${this.apiUrl}/${id}`);
  }

  createService(service: BeautyService): Observable<BeautyService> {
    // For development, save to mock data
    if (!environment.production) {
      const newService = {
        ...service,
        id: this.mockId++,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.mockServices.push(newService);
      return of(newService).pipe(delay(500));
    }

    return this.post<BeautyService>(this.apiUrl, service);
  }

  updateService(id: number, service: BeautyService): Observable<BeautyService> {
    // For development, update mock data
    if (!environment.production) {
      const index = this.mockServices.findIndex(s => s.id === id);
      if (index !== -1) {
        const updatedService = {
          ...service,
          updatedAt: new Date()
        };
        this.mockServices[index] = updatedService;
        return of(updatedService).pipe(delay(500));
      }
      throw new Error('Service not found');
    }

    return this.put<BeautyService>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    // For development, delete from mock data
    if (!environment.production) {
      const index = this.mockServices.findIndex(s => s.id === id);
      if (index !== -1) {
        this.mockServices.splice(index, 1);
        return of(undefined).pipe(delay(500));
      }
      throw new Error('Service not found');
    }

    return this.delete<void>(`${this.apiUrl}/${id}`);
  }

  getServiceHistory(serviceId: number): Observable<ServiceHistory[]> {
    return this.get<ServiceHistory[]>(`${this.apiUrl}/${serviceId}/history`);
  }

  uploadImage(file: File): Observable<string> {
    // For development, return a mock URL
    if (!environment.production) {
      return of(`/assets/images/services/mock-${Date.now()}.jpg`).pipe(delay(1000));
    }

    const formData = new FormData();
    formData.append('image', file);
    return this.post<{ url: string }>(`${this.apiUrl}/upload`, formData)
      .pipe(map(response => response.url));
  }
} 