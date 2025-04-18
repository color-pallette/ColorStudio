import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../services/base.service';
import { NailService, NailServiceHistory } from '../../models/nail-service.model';

@Injectable({
  providedIn: 'root'
})
export class NailServiceService extends BaseService {
  protected override apiUrl = `${environment.apiUrl}/nail-services`;

  constructor(http: HttpClient) {
    super(http);
  }

  getServices(): Observable<NailService[]> {
    return this.get<NailService[]>(this.apiUrl);
  }

  getService(id: number): Observable<NailService> {
    return this.get<NailService>(`${this.apiUrl}/${id}`);
  }

  createService(service: NailService): Observable<NailService> {
    return this.post<NailService>(this.apiUrl, service);
  }

  updateService(id: number, service: NailService): Observable<NailService> {
    return this.put<NailService>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/${id}`);
  }

  getServiceHistory(id: number): Observable<NailServiceHistory[]> {
    return this.get<NailServiceHistory[]>(`${this.apiUrl}/${id}/history`);
  }
} 