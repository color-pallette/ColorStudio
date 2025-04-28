import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { AppointmentFormDialogComponent } from '../appointment-form-dialog/appointment-form-dialog.component';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss']
})
export class AppointmentCalendarComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedDate: Date = new Date();
  loading = false;
  error: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;

    this.appointmentService.getAppointmentsByDate(this.selectedDate)
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.error = this.translate.instant('appointment.errors.loadFailed');
          this.loading = false;
        }
      });
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.loadAppointments();
  }

  openAppointmentForm(appointment?: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '500px',
      data: { appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  getStatusClass(status: AppointmentStatus): string {
    return status.toLowerCase();
  }

  getStatusTranslation(status: AppointmentStatus): string {
    return this.translate.instant(`appointment.status.${status.toLowerCase()}`);
  }
} 