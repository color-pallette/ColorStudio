import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { AppointmentCalendarComponent } from './components/appointment-calendar/appointment-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentListComponent
  },
  {
    path: 'new',
    component: AppointmentFormComponent
  },
  {
    path: 'calendar',
    component: AppointmentCalendarComponent
  },
  {
    path: ':id',
    component: AppointmentDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { } 