import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { AppointmentFormDialogComponent } from '../appointment-form-dialog/appointment-form-dialog.component';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  appointment: Appointment | null = null;
  loading = false;
  error: string | null = null;
  AppointmentStatus = AppointmentStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment: Appointment | undefined) => {
        if (appointment) this.appointment = appointment;
      },
      error: (error: any) => {
        console.error('Error loading appointment:', error);
      }
    });
  }

  editAppointment(): void {
    if (!this.appointment) return;

    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '500px',
      data: { appointment: this.appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.appointmentService.getAppointmentById(id).subscribe({
          next: (appointment: Appointment | undefined) => {
            if (appointment) this.appointment = appointment;
          },
          error: (error: any) => {
            console.error('Error loading appointment:', error);
          }
        });
      }
    });
  }

  completeAppointment(): void {
    if (!this.appointment) return;

    this.appointmentService.updateAppointment(this.appointment.id, { status: AppointmentStatus.Completed })
      .subscribe({
        next: () => {
          this.showSuccess('appointment.completeSuccess');
          const id = Number(this.route.snapshot.paramMap.get('id'));
          this.appointmentService.getAppointmentById(id).subscribe({
            next: (appointment: Appointment | undefined) => {
              if (appointment) this.appointment = appointment;
            },
            error: (error: any) => {
              console.error('Error loading appointment:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error completing appointment:', error);
          this.showError('appointment.errors.completeFailed');
        }
      });
  }

  cancelAppointment(): void {
    if (!this.appointment) return;

    if (confirm(this.translate.instant('appointment.confirmCancel'))) {
      this.appointmentService.updateAppointment(this.appointment.id, { status: AppointmentStatus.Cancelled })
        .subscribe({
          next: () => {
            this.showSuccess('appointment.cancelSuccess');
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.appointmentService.getAppointmentById(id).subscribe({
              next: (appointment: Appointment | undefined) => {
                if (appointment) this.appointment = appointment;
              },
              error: (error: any) => {
                console.error('Error loading appointment:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error cancelling appointment:', error);
            this.showError('appointment.errors.cancelFailed');
          }
        });
    }
  }

  backToList(): void {
    this.router.navigate(['/appointments']);
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