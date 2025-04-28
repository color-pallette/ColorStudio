import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeautyServiceListComponent } from './components/beauty-service-list/beauty-service-list.component';
import { BeautyServiceFormComponent } from './components/beauty-service-form/beauty-service-form.component';
import { BeautyServiceDetailsComponent } from './components/beauty-service-details/beauty-service-details.component';

const routes: Routes = [
  {
    path: '',
    component: BeautyServiceListComponent
  },
  {
    path: 'new',
    component: BeautyServiceFormComponent
  },
  {
    path: 'edit/:id',
    component: BeautyServiceFormComponent
  },
  {
    path: 'details/:id',
    component: BeautyServiceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeautyServicesRoutingModule { } 