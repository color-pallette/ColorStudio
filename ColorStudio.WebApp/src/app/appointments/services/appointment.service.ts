import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { delay } from 'rxjs/operators';
import { Customer } from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  // Mock data for testing
  private mockAppointments: Appointment[] = [
    {
      id: 1,
      customerId: 1,
      customerName: 'سارا محمدی',
      serviceId: 1,
      serviceName: 'رنگ مو',
      staffId: 1,
      staffName: 'مریم احمدی',
      date: new Date('2024-04-28'),
      startTime: '10:00',
      endTime: '12:00',
      status: AppointmentStatus.Scheduled,
      notes: 'رنگ موی قهوه‌ای تیره',
      price: 250000
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'نازنین رضایی',
      serviceId: 2,
      serviceName: 'کوتاهی مو',
      staffId: 2,
      staffName: 'فاطمه حسینی',
      date: new Date('2024-04-28'),
      startTime: '14:00',
      endTime: '15:00',
      status: AppointmentStatus.Completed,
      notes: 'کوتاهی لایه‌ای',
      price: 120000
    },
    {
      id: 3,
      customerId: 3,
      customerName: 'مینا کریمی',
      serviceId: 3,
      serviceName: 'هایلایت',
      staffId: 1,
      staffName: 'مریم احمدی',
      date: new Date('2024-04-29'),
      startTime: '11:00',
      endTime: '14:00',
      status: AppointmentStatus.Scheduled,
      notes: 'هایلایت تار به تار',
      price: 350000
    }
  ];

  // Mock customers for testing
  private mockCustomers: Customer[] = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '09123456789',
      email: 'sarah@example.com',
      membershipLevel: 'Gold',
      lastVisitDate: new Date('2024-02-15'),
      totalVisits: 12,
      totalSpent: 1200,
      notes: 'Regular customer, prefers Emma for hair services',
      birthDate: new Date('1990-01-01'),
      gender: 'Female',
      address: '123 Main St',
      isVerified: true,
      isActive: true,
      skinType: 'Normal',
      hairType: 'Straight',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Brown',
      phone: '09123456788',
      email: 'michael@example.com',
      membershipLevel: 'Silver',
      lastVisitDate: new Date('2024-03-01'),
      totalVisits: 5,
      totalSpent: 450,
      notes: 'New customer, interested in hair services',
      birthDate: new Date('1992-01-01'),
      gender: 'Male',
      address: '456 Oak St',
      isVerified: true,
      isActive: true,
      skinType: 'Oily',
      hairType: 'Curly',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return of(this.mockAppointments);
  }

  getAppointmentById(id: number): Observable<Appointment | undefined> {
    const appointment = this.mockAppointments.find(a => a.id === id);
    return of(appointment);
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.max(...this.mockAppointments.map(a => a.id)) + 1
    };
    this.mockAppointments.push(newAppointment);
    return of(newAppointment);
  }

  updateAppointment(id: number, updates: Partial<Appointment>): Observable<Appointment> {
    const index = this.mockAppointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAppointments[index] = { ...this.mockAppointments[index], ...updates };
      return of(this.mockAppointments[index]);
    }
    throw new Error('Appointment not found');
  }

  deleteAppointment(id: number): Observable<void> {
    this.mockAppointments = this.mockAppointments.filter(a => a.id !== id);
    return of(void 0);
  }

  getCustomerAppointments(customerId: number): Observable<Appointment[]> {
    const appointments = this.mockAppointments.filter(a => a.customerId === customerId);
    return of(appointments);
  }

  getStaffAppointments(staffId: number): Observable<Appointment[]> {
    const appointments = this.mockAppointments.filter(a => a.staffId === staffId);
    return of(appointments);
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    const appointments = this.mockAppointments.filter(a => 
      a.date.getFullYear() === date.getFullYear() &&
      a.date.getMonth() === date.getMonth() &&
      a.date.getDate() === date.getDate()
    );
    return of(appointments);
  }

  getAvailableStaff(date: string, timeSlot: string): Observable<string[]> {
    // Mock available staff
    return of(['مریم احمدی', 'فاطمه حسینی', 'زهرا محمدی']);
  }

  searchCustomers(query: string): Observable<any[]> {
    // Mock customer search
    return of([
      { id: 1, firstName: 'سارا', lastName: 'محمدی' },
      { id: 2, firstName: 'نازنین', lastName: 'رضایی' },
      { id: 3, firstName: 'مینا', lastName: 'کریمی' }
    ]);
  }

  getAvailableTimeSlots(date: string, serviceId: number): Observable<string[]> {
    // Mock available time slots
    return of(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
  }
} 