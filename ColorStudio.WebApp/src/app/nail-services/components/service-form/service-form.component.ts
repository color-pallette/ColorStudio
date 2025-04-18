import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NailServiceService } from '../../services/nail-service.service';
import { NailService } from '../../../models/nail-service.model';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  serviceForm!: FormGroup;
  isEditMode = false;
  serviceId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private nailService: NailServiceService,
    private translate: TranslateService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.serviceId = +params['id'];
        this.loadService();
      }
    });
  }

  private createForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(5)]],
      isActive: [true],
      categoryId: ['', Validators.required],
      imageUrl: ['']
    });
  }

  private loadService(): void {
    this.nailService.getService(this.serviceId).subscribe(service => {
      this.serviceForm.patchValue(service);
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const service: NailService = this.serviceForm.value;
      
      if (this.isEditMode) {
        this.nailService.updateService(this.serviceId, service).subscribe(() => {
          this.router.navigate(['/nail-services']);
        });
      } else {
        this.nailService.createService(service).subscribe(() => {
          this.router.navigate(['/nail-services']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/nail-services']);
  }
} 