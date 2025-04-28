import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BeautyServiceService } from '../../../shared/services/beauty-service.service';
import { BeautyService, ServiceType } from '../../../shared/models/beauty-service.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-beauty-service-form',
  templateUrl: './beauty-service-form.component.html',
  styleUrls: ['./beauty-service-form.component.scss']
})
export class BeautyServiceFormComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  
  service: BeautyService | null = null;
  serviceForm!: FormGroup;
  loading = false;
  selectedImage: File | null = null;
  isCapturing = false;
  stream: MediaStream | null = null;
  serviceTypes = ServiceType;
  ServiceType = ServiceType;

  constructor(
    private formBuilder: FormBuilder,
    private beautyService: BeautyServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.beautyService.getService(+id).subscribe({
        next: (service) => {
          this.service = service;
          this.serviceForm.patchValue({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            isActive: service.isActive,
            type: service.type,
            imageUrl: service.imageUrl
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading service:', error);
          this.loading = false;
          this.snackBar.open(
            this.translate.instant('beautyServices.errors.loadFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/beauty-services']);
        }
      });
    }
  }

  private createForm(): void {
    this.serviceForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.required, Validators.min(0)]],
      type: [ServiceType.HAIR, [Validators.required]],
      isActive: [true],
      imageUrl: ['']
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.loading = true;
      const now = new Date();
      const serviceData: BeautyService = {
        id: this.service?.id ?? 0,
        name: this.serviceForm.get('name')?.value,
        description: this.serviceForm.get('description')?.value,
        price: this.serviceForm.get('price')?.value,
        duration: this.serviceForm.get('duration')?.value,
        isActive: this.serviceForm.get('isActive')?.value,
        type: this.serviceForm.get('type')?.value,
        imageUrl: this.serviceForm.get('imageUrl')?.value,
        createdAt: this.service?.createdAt ?? now,
        updatedAt: now
      };

      if (this.selectedImage) {
        this.uploadImageFirst(serviceData);
      } else {
        this.saveService(serviceData);
      }
    }
  }

  private saveService(serviceData: BeautyService): void {
    const request = this.service?.id
      ? this.beautyService.updateService(this.service.id, serviceData)
      : this.beautyService.createService(serviceData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant(this.service ? 'beautyServices.updateSuccess' : 'beautyServices.createSuccess'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
        this.router.navigate(['/beauty-services']);
      },
      error: (error) => {
        console.error('Error saving service:', error);
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('beautyServices.errors.saveFailed'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
    });
  }

  private uploadImageFirst(serviceData: BeautyService): void {
    if (!this.selectedImage) return;

    this.fileUploadService.uploadFile(this.selectedImage).subscribe({
      next: (response) => {
        serviceData.imageUrl = response.url;
        this.saveService(serviceData);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('color.errors.imageUploadFailed'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImage = input.files[0];
      this.snackBar.open(
        this.translate.instant('color.imageSelected'),
        this.translate.instant('common.close'),
        { duration: 2000 }
      );
    }
  }

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.isCapturing = true;
      }
    } catch (err) {
      this.snackBar.open(
        this.translate.instant('color.errors.cameraAccess'),
        this.translate.instant('common.close'),
        { duration: 3000 }
      );
    }
  }

  async captureImage(): Promise<void> {
    if (!this.videoElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        this.selectedImage = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        this.stopCamera();
      }
    }, 'image/jpeg');
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCapturing = false;
  }

  onCancel(): void {
    this.router.navigate(['/beauty-services']);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
} 