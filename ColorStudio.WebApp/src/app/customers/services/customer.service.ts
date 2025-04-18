import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../services/base.service';
import { Customer, CustomerAppointment, CustomerHistory } from 'src/app/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  protected override apiUrl = `${environment.apiUrl}/customers`;

  constructor(http: HttpClient) {
    super(http);
  }

  getCustomers(): Observable<Customer[]> {
    return this.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCustomerByPhone(phone: string): Observable<Customer> {
    return this.get<Customer>(`${this.apiUrl}/phone/${phone}`);
  }

  getCustomerAppointments(customerId: number): Observable<CustomerAppointment[]> {
    return this.get<CustomerAppointment[]>(`${this.apiUrl}/${customerId}/appointments`);
  }

  getCustomerHistory(customerId: number): Observable<CustomerHistory[]> {
    return this.get<CustomerHistory[]>(`${this.apiUrl}/${customerId}/history`);
  }
} 