import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentService } from '../../services/appointment.service';
import { BeautyServiceService } from '../../../shared/services/beauty-service.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { Customer } from '../../../models/customer.model';
import { BeautyService } from '../../../shared/models/beauty-service.model';
import { AppointmentStatus } from '../../../models/appointment.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatProgressBarModule
  ]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  services: BeautyService[] = [];
  filteredCustomers$: Observable<Customer[]> = of([]);
  availableTimeSlots: string[] = [];
  availableStaff: string[] = [];
  loading = false;
  selectedCustomer: Customer | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private beautyServiceService: BeautyServiceService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.appointmentForm = this.fb.group({
      customerSearch: [''],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      staffName: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Load services
    this.loadServices();

    // Setup customer search
    this.setupCustomerSearch();

    // Check for customer ID from route params
    this.route.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.loadCustomer(params['customerId']);
      }
    });

    // Watch for date and service changes
    this.watchDateAndServiceChanges();
  }

  private loadServices(): void {
    this.beautyServiceService.getBeautyServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.showError('errors.loadServicesFailed');
      }
    });
  }

  private setupCustomerSearch(): void {
    this.filteredCustomers$ = this.appointmentForm.get('customerSearch')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (typeof value === 'string' && value.length >= 2) {
          return this.appointmentService.searchCustomers(value).pipe(
            catchError(error => {
              console.error('Error searching customers:', error);
              this.showError('errors.searchCustomersFailed');
              return of([]);
            })
          );
        }
        return of([]);
      })
    );
  }

  private loadCustomer(id: number): void {
    this.loading = true;
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.selectedCustomer = customer;
        this.appointmentForm.patchValue({
          customerSearch: `${customer.firstName} ${customer.lastName}`
        });
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.showError('errors.loadCustomerFailed');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private watchDateAndServiceChanges(): void {
    // Watch for date and service selection to load available time slots
    this.appointmentForm.get('date')!.valueChanges.pipe(
      switchMap(date => {
        const serviceId = this.appointmentForm.get('serviceId')!.value;
        if (date && serviceId) {
          return this.appointmentService.getAvailableTimeSlots(date, serviceId);
        }
        return of([]);
      })
    ).subscribe(slots => {
      this.availableTimeSlots = slots;
      this.appointmentForm.get('timeSlot')!.setValue('');
    });

    // Watch for time slot selection to load available staff
    this.appointmentForm.get('timeSlot')!.valueChanges.pipe(
      switchMap(timeSlot => {
        const date = this.appointmentForm.get('date')!.value;
        if (date && timeSlot) {
          return this.appointmentService.getAvailableStaff(date, timeSlot);
        }
        return of([]);
      })
    ).subscribe(staff => {
      this.availableStaff = staff;
      this.appointmentForm.get('staffName')!.setValue('');
    });
  }

  displayCustomer(customer: Customer): string {
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }

  onCustomerSelected(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  createNewCustomer(): void {
    // Navigate to customer creation form with return URL
    const returnUrl = this.router.createUrlTree(['/appointments/new']).toString();
    this.router.navigate(['/customers/add'], {
      queryParams: { returnUrl }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid && this.selectedCustomer) {
      const formValue = this.appointmentForm.value;
      
      const appointment = {
        customerId: this.selectedCustomer.id,
        customerName: `${this.selectedCustomer.firstName} ${this.selectedCustomer.lastName}`,
        serviceId: formValue.serviceId,
        serviceName: this.services.find(s => s.id === formValue.serviceId)?.name || '',
        staffId: 0, // Will be set on the server
        staffName: formValue.staffName,
        date: formValue.date,
        startTime: formValue.timeSlot,
        endTime: '', // Will be calculated on the server
        status: AppointmentStatus.Scheduled,
        notes: formValue.notes,
        price: this.services.find(s => s.id === formValue.serviceId)?.price || 0
      };

      this.loading = true;
      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          this.showSuccess('appointment.createSuccess');
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          this.showError('appointment.errors.createFailed');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private showSuccess(key: string): void {
    this.snackBar.open(
      this.translate.instant(key),
      this.translate.instant('common.close'),
      { duration: 3000 }
    );
  }

  private showError(key: string): void {
    this.snackBar.open(
      this.translate.instant(key),
      this.translate.instant('common.close'),
      { duration: 5000 }
    );
  }
} 