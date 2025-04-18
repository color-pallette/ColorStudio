import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../services/customer.service';
import { Customer, CustomerAppointment, CustomerHistory } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customer!: Customer;
  appointments: CustomerAppointment[] = [];
  history: CustomerHistory[] = [];
  activeTab = 0;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.loadCustomer(id);
    this.loadAppointments(id);
    this.loadHistory(id);
  }

  loadCustomer(id: number): void {
    this.customerService.getCustomer(id).subscribe(customer => {
      this.customer = customer;
    });
  }

  loadAppointments(id: number): void {
    this.customerService.getCustomerAppointments(id).subscribe(appointments => {
      this.appointments = appointments;
    });
  }

  loadHistory(id: number): void {
    this.customerService.getCustomerHistory(id).subscribe(history => {
      this.history = history;
    });
  }

  editCustomer(): void {
    this.router.navigate(['/customers/edit', this.customer.id]);
  }

  getMembershipBadgeClass(): string {
    return this.customer?.membershipLevel?.toLowerCase() || 'regular';
  }

  getStatusIcon(): string {
    return this.customer?.isActive ? 'check_circle' : 'cancel';
  }

  getStatusClass(): string {
    return this.customer?.isActive ? 'active' : 'inactive';
  }
} 