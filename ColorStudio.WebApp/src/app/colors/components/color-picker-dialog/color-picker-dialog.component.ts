import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ColorPickerDialogData {
  currentColor: string;
}

@Component({
  selector: 'app-color-picker-dialog',
  template: `
    <h2 mat-dialog-title>{{ 'color.pickColor' | translate }}</h2>
    <mat-dialog-content>
      <div class="color-picker-container">
        <input type="color" [value]="data.currentColor" #colorInput>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-flat-button color="primary" (click)="onSelect(colorInput.value)">
        {{ 'common.select' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .color-picker-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    input[type="color"] {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ColorPickerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ColorPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColorPickerDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(color: string): void {
    this.dialogRef.close(color);
  }
} 