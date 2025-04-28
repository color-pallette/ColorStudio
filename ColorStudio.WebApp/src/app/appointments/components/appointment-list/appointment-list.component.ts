import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  displayedColumns: string[] = [
    'customerName',
    'serviceName',
    'date',
    'startTime',
    'staffName',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<Appointment>;
  loading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource<Appointment>([]);
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;

    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.dataSource.data = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.error = this.translate.instant('appointment.errors.loadFailed');
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: AppointmentStatus): string {
    return status.toLowerCase();
  }

  getStatusTranslation(status: AppointmentStatus): string {
    return this.translate.instant(`appointment.status.${status.toLowerCase()}`);
  }

  addAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  viewAppointment(id: number): void {
    this.router.navigate(['/appointments', id]);
  }

  editAppointment(id: number): void {
    this.router.navigate(['/appointments/edit', id]);
  }

  cancelAppointment(id: number): void {
    if (confirm(this.translate.instant('appointment.confirmCancel'))) {
      this.appointmentService.updateAppointment(id, { status: AppointmentStatus.Cancelled })
        .subscribe({
          next: () => {
            this.showSuccess('appointment.cancelSuccess');
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Error cancelling appointment:', error);
            this.showError('appointment.errors.cancelFailed');
          }
        });
    }
  }

  completeAppointment(id: number): void {
    this.appointmentService.updateAppointment(id, { status: AppointmentStatus.Completed })
      .subscribe({
        next: () => {
          this.showSuccess('appointment.completeSuccess');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error completing appointment:', error);
          this.showError('appointment.errors.completeFailed');
        }
      });
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