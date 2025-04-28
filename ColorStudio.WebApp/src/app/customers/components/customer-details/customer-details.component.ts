import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../services/customer.service';
import { Customer, CustomerAppointment, CustomerHistory } from '../../../models/customer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customer: Customer | null = null;
  appointments: CustomerAppointment[] = [];
  history: CustomerHistory[] = [];
  activeTab = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!id) {
      this.error = this.translate.instant('customers.errors.invalidId');
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        if (!customer) {
          this.error = this.translate.instant('customers.errors.notFound');
          return;
        }
        this.customer = customer;
        this.loadAppointments(id);
        this.loadHistory(id);
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.error = this.translate.instant('customers.errors.loadFailed');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  refresh(): void {
    this.loadData();
  }

  loadAppointments(id: number): void {
    this.customerService.getCustomerAppointments(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.snackBar.open(
            this.translate.instant('customers.errors.appointmentsLoadFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        }
      });
  }

  loadHistory(id: number): void {
    this.customerService.getCustomerHistory(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (history) => {
          this.history = history;
        },
        error: (error) => {
          console.error('Error loading history:', error);
          this.snackBar.open(
            this.translate.instant('customers.errors.historyLoadFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  editCustomer(): void {
    if (this.customer) {
      this.router.navigate(['/customers/edit', this.customer.id]);
    }
  }

  getMembershipBadgeClass(): string {
    if (!this.customer?.membershipLevel) return '';
    return this.customer.membershipLevel;
  }

  getStatusIcon(): string {
    return this.customer?.isActive ? 'check_circle' : 'cancel';
  }

  getStatusClass(): string {
    return this.customer?.isActive ? 'active' : 'inactive';
  }

  getHistoryIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'appointment':
        return 'event';
      case 'payment':
        return 'payments';
      case 'service':
        return 'spa';
      default:
        return 'history';
    }
  }

  bookAppointment(): void {
    if (this.customer) {
      this.router.navigate(['/appointments/new'], {
        queryParams: { customerId: this.customer.id }
      });
    }
  }
} 