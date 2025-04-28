export enum AppointmentStatus {
  Scheduled = 'scheduled',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no-show'
}

export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  serviceId: number;
  serviceName: string;
  staffId: number;
  staffName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  price: number;
} 