import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Color, ColorCategory } from '../../../models/color.model';
import { ColorService } from '../../services/color.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { hexColorValidator } from '../../../shared/validators/hex-color.validator';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from '../color-picker-dialog/color-picker-dialog.component';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit {
  color: Color | null = null;
  colorForm: FormGroup;
  hexCodeControl: FormControl;
  loading = false;
  selectedImage: File | null = null;
  categories = Object.values(ColorCategory);

  constructor(
    private formBuilder: FormBuilder,
    private colorService: ColorService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.hexCodeControl = new FormControl('', [Validators.required, hexColorValidator()]);
    this.colorForm = this.formBuilder.group({
      name: ['', Validators.required],
      hexCode: this.hexCodeControl,
      brandName: ['', Validators.required],
      categoryName: ['', Validators.required],
      description: [''],
      isActive: [true],
      inStock: [true],
      popularity: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.colorService.getColor(+id).subscribe({
        next: (color) => {
          this.color = color;
          this.colorForm.patchValue({
            name: color.name,
            hexCode: color.hexCode,
            brandName: color.brandName,
            categoryName: color.categoryName,
            description: color.description,
            isActive: color.isActive,
            inStock: color.inStock,
            popularity: color.popularity
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading color:', error);
          this.loading = false;
          this.snackBar.open(
            this.translate.instant('colors.errors.loadFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/colors']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.colorForm.valid) {
      this.loading = true;
      const now = new Date();
      const colorData: Color = {
        id: this.color?.id ?? 0,
        name: this.colorForm.get('name')?.value,
        code: this.hexCodeControl.value.replace('#', ''),
        hexCode: this.hexCodeControl.value,
        brandId: this.color?.brandId ?? 1,
        brandName: this.colorForm.get('brandName')?.value,
        categoryId: this.color?.categoryId ?? 1,
        categoryName: this.colorForm.get('categoryName')?.value,
        description: this.colorForm.get('description')?.value,
        isActive: this.colorForm.get('isActive')?.value,
        inStock: this.colorForm.get('inStock')?.value,
        popularity: this.colorForm.get('popularity')?.value,
        createdAt: this.color?.createdAt ?? now,
        updatedAt: now
      };

      if (this.selectedImage) {
        this.uploadImageFirst(colorData);
      } else {
        this.saveColor(colorData);
      }
    }
  }

  private saveColor(colorData: Color): void {
    const request = this.color
      ? this.colorService.updateColor(colorData.id, colorData)
      : this.colorService.createColor(colorData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant(this.color ? 'colors.updateSuccess' : 'colors.createSuccess'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
        this.router.navigate(['/colors']);
      },
      error: (error) => {
        console.error('Error saving color:', error);
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('colors.errors.saveFailed'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
    });
  }

  private uploadImageFirst(colorData: Color): void {
    if (!this.selectedImage) return;

    this.colorService.uploadImage(this.selectedImage).subscribe({
      next: (imageUrl) => {
        colorData.imageUrl = imageUrl;
        this.saveColor(colorData);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('colors.errors.imageUploadFailed'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
    });
  }

  openColorPicker(): void {
    const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
      width: '300px',
      data: { currentColor: this.hexCodeControl.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hexCodeControl.setValue(result);
      }
    });
  }

  uploadImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.selectedImage = file;
        this.snackBar.open(
          this.translate.instant('colors.imageSelected'),
          this.translate.instant('common.close'),
          { duration: 2000 }
        );
      }
    };
    input.click();
  }

  async takePhoto(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          this.selectedImage = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          this.snackBar.open(
            this.translate.instant('colors.photoTaken'),
            this.translate.instant('common.close'),
            { duration: 2000 }
          );
        }
      }, 'image/jpeg');

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.snackBar.open(
        this.translate.instant('colors.errors.cameraAccessFailed'),
        this.translate.instant('common.close'),
        { duration: 3000 }
      );
    }
  }

  onColorChange(hexCode: string): void {
    this.hexCodeControl.setValue(hexCode);
  }
} 