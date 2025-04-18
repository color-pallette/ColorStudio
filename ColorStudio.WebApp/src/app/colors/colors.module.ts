import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ColorsRoutingModule } from './colors-routing.module';
import { ColorListComponent } from './components/color-list/color-list.component';
import { ColorFormComponent } from './components/color-form/color-form.component';
import { ColorPickerDialogComponent } from './components/color-picker-dialog/color-picker-dialog.component';
import { ColorService } from './services/color.service';

@NgModule({
  declarations: [
    ColorListComponent,
    ColorFormComponent,
    ColorPickerDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    ColorsRoutingModule
  ],
  providers: [
    ColorService
  ]
})
export class ColorsModule { } 