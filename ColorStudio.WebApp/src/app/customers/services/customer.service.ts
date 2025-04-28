import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/services/base.service';
import { Customer, CustomerAppointment, CustomerHistory } from 'src/app/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  protected override apiUrl = `${environment.apiUrl}/customers`;

  private mockCustomers: Customer[] = [
    {
      id: 1,
      firstName: 'سارا',
      lastName: 'احمدی',
      phone: '09123456789',
      email: 'sara@example.com',
      birthDate: new Date('1990-05-15'),
      address: 'تهران، خیابان ولیعصر',
      isActive: true,
      membershipLevel: 'gold',
      totalVisits: 15,
      totalSpent: 750,
      gender: 'FEMALE',
      isVerified: true,
      lastVisitDate: new Date('2024-01-15'),
      skinType: 'NORMAL',
      hairType: 'STRAIGHT',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      firstName: 'لیلا',
      lastName: 'فائز',
      phone: '09187654321',
      email: 'leila@example.com',
      birthDate: new Date('1992-08-20'),
      address: 'تهران، خیابان شریعتی',
      isActive: true,
      membershipLevel: 'silver',
      totalVisits: 8,
      totalSpent: 350,
      gender: 'FEMALE',
      isVerified: false,
      lastVisitDate: new Date('2024-01-20'),
      skinType: 'DRY',
      hairType: 'WAVY',
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-01')
    },
    {
      id: 3,
      firstName: 'زهرا',
      lastName: 'امینی',
      phone: '09365478912',
      email: 'zahra@example.com',
      birthDate: new Date('1988-12-10'),
      address: 'تهران، خیابان پاسداران',
      isActive: false,
      membershipLevel: 'bronze',
      totalVisits: 3,
      totalSpent: 150,
      gender: 'FEMALE',
      isVerified: false,
      lastVisitDate: new Date('2023-12-01'),
      skinType: 'OILY',
      hairType: 'CURLY',
      createdAt: new Date('2023-03-01'),
      updatedAt: new Date('2023-03-01')
    }
  ];

  private mockAppointments: CustomerAppointment[] = [
    {
      id: 1,
      customerId: 1,
      serviceId: 1,
      serviceName: 'رنگ مو',
      date: new Date('2024-02-20T10:00:00'),
      startTime: '10:00',
      endTime: '12:00',
      staffId: 1,
      staffName: 'نرگس رضایی',
      status: 'SCHEDULED',
      price: 75,
      notes: 'رنگ موی قهوه‌ای تیره با هایلایت'
    },
    {
      id: 2,
      customerId: 1,
      serviceId: 2,
      serviceName: 'مانیکور و پدیکور',
      date: new Date('2024-02-25T14:00:00'),
      startTime: '14:00',
      endTime: '15:30',
      staffId: 2,
      staffName: 'مینا کریمی',
      status: 'SCHEDULED',
      price: 50,
      notes: 'طراحی ناخن با رنگ صورتی و نگین‌کاری'
    }
  ];

  private mockHistory: CustomerHistory[] = [
    {
      id: 1,
      customerId: 1,
      type: 'APPOINTMENT',
      date: new Date('2024-02-20'),
      description: 'رزرو نوبت رنگ مو',
      amount: 75,
      staffId: 1,
      staffName: 'نرگس رضایی',
      relatedEntityId: 1,
      relatedEntityType: 'SERVICE'
    },
    {
      id: 2,
      customerId: 1,
      type: 'PAYMENT',
      date: new Date('2024-02-20'),
      description: 'پیش پرداخت رنگ مو',
      amount: 30,
      staffId: 1,
      staffName: 'نرگس رضایی',
      relatedEntityId: 1,
      relatedEntityType: 'PAYMENT'
    }
  ];

  constructor(http: HttpClient) {
    super(http);
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.mockCustomers);
  }

  getCustomer(id: number): Observable<Customer> {
    console.log('Getting customer with ID:', id);
    const customerId = Number(id);
    const customer = this.mockCustomers.find(c => c.id === customerId);
    console.log('Found customer:', customer);
    if (!customer) {
      console.error('No customer found with ID:', id);
      return of(null as any);
    }
    return of(customer);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    const newCustomer = { ...customer, id: this.mockCustomers.length + 1 };
    this.mockCustomers.push(newCustomer);
    return of(newCustomer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const index = this.mockCustomers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      this.mockCustomers[index] = { ...customer };
      return of(this.mockCustomers[index]);
    }
    return of(customer);
  }

  deleteCustomer(id: number): Observable<void> {
    const index = this.mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCustomers.splice(index, 1);
    }
    return of(void 0);
  }

  getCustomerByPhone(phone: string): Observable<Customer | null> {
    const customer = this.mockCustomers.find(c => c.phone === phone);
    return of(customer || null);
  }

  getCustomerAppointments(customerId: number): Observable<CustomerAppointment[]> {
    console.log('Service - Fetching appointments for customer:', customerId);
    const id = Number(customerId);
    const appointments = this.mockAppointments.filter(a => a.customerId === id);
    console.log('Service - Found appointments:', appointments);
    return of(appointments);
  }

  getCustomerHistory(customerId: number): Observable<CustomerHistory[]> {
    console.log('Service - Fetching history for customer:', customerId);
    const id = Number(customerId);
    const history = this.mockHistory.filter(h => h.customerId === id);
    console.log('Service - Found history:', history);
    return of(history);
  }
} 