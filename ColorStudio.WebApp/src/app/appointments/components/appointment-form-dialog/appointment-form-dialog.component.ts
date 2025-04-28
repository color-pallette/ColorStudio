import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointment-form-dialog',
  templateUrl: './appointment-form-dialog.component.html',
  styleUrls: ['./appointment-form-dialog.component.scss']
})
export class AppointmentFormDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentFormDialogComponent>,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { appointment?: Appointment }
  ) {
    this.appointmentForm = this.fb.group({
      customerName: ['', Validators.required],
      serviceName: ['', Validators.required],
      staffName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.appointment) {
      this.appointmentForm.patchValue({
        customerName: this.data.appointment.customerName,
        serviceName: this.data.appointment.serviceName,
        staffName: this.data.appointment.staffName,
        price: this.data.appointment.price,
        date: this.data.appointment.date,
        startTime: this.data.appointment.startTime,
        endTime: this.data.appointment.endTime,
        notes: this.data.appointment.notes
      });
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.loading = true;
      const formValue = this.appointmentForm.value;
      const appointment: Appointment = {
        id: this.data.appointment?.id || 0,
        customerId: 0, // This should be set based on the selected customer
        customerName: formValue.customerName,
        serviceId: 0, // This should be set based on the selected service
        serviceName: formValue.serviceName,
        staffId: 0, // This should be set based on the selected staff
        staffName: formValue.staffName,
        date: formValue.date,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        status: AppointmentStatus.Scheduled,
        notes: formValue.notes,
        price: formValue.price
      };

      const saveObservable = this.data.appointment
        ? this.appointmentService.updateAppointment(this.data.appointment.id, appointment)
        : this.appointmentService.createAppointment(appointment);

      saveObservable.subscribe({
        next: () => {
          this.showSuccess(this.data.appointment ? 'appointment.updateSuccess' : 'appointment.createSuccess');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
          this.showError('appointment.errors.saveFailed');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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