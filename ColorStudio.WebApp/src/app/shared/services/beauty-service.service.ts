import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from './base.service';
import { BeautyService, ServiceHistory, ServiceType } from '../models/beauty-service.model';

@Injectable({
  providedIn: 'root'
})
export class BeautyServiceService extends BaseService {
  protected override apiUrl = `${environment.apiUrl}/beauty-services`;
  private mockServices: BeautyService[] = [
    {
      id: 1,
      name: 'رنگ مو',
      description: 'رنگ کردن مو با استفاده از محصولات با کیفیت',
      price: 2500000,
      duration: 120,
      type: ServiceType.HAIR,
      isActive: true,
      imageUrl: '/assets/images/services/hair-color.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'مانیکور',
      description: 'مانیکور حرفه‌ای با استفاده از محصولات درجه یک',
      price: 1500000,
      duration: 60,
      type: ServiceType.NAIL,
      isActive: true,
      imageUrl: '/assets/images/services/manicure.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'پاکسازی پوست',
      description: 'پاکسازی عمیق پوست با متدهای روز دنیا',
      price: 3000000,
      duration: 90,
      type: ServiceType.FACE,
      isActive: false,
      imageUrl: '/assets/images/services/facial.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(http: HttpClient) {
    super(http);
  }

  getServices(type?: ServiceType): Observable<BeautyService[]> {
    let services = this.mockServices;
    if (type) {
      services = services.filter(service => service.type === type);
    }
    return of(services);
  }

  getBeautyServices(): Observable<BeautyService[]> {
    return this.getServices();
  }

  getService(id: number): Observable<BeautyService> {
    const service = this.mockServices.find(s => s.id === id);
    if (!service) {
      return throwError(() => new Error('Service not found'));
    }
    return of(service);
  }

  createService(service: BeautyService): Observable<BeautyService> {
    const maxId = this.mockServices.reduce((max, s) => Math.max(max, s.id || 0), 0);
    const newService = {
      ...service,
      id: maxId + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockServices.push(newService);
    return of(newService);
  }

  updateService(id: number, service: BeautyService): Observable<BeautyService> {
    const index = this.mockServices.findIndex(s => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Service not found'));
    }
    const updatedService = {
      ...service,
      id,
      updatedAt: new Date()
    };
    this.mockServices[index] = updatedService;
    return of(updatedService);
  }

  deleteService(id: number): Observable<void> {
    const index = this.mockServices.findIndex(s => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Service not found'));
    }
    this.mockServices.splice(index, 1);
    return of(void 0);
  }

  getServiceHistory(serviceId: number): Observable<ServiceHistory[]> {
    return of([]);
  }

  addServiceHistory(history: ServiceHistory): Observable<ServiceHistory> {
    return of(history);
  }

  updateServiceHistory(serviceId: number, historyId: number, history: ServiceHistory): Observable<ServiceHistory> {
    return of(history);
  }
} 