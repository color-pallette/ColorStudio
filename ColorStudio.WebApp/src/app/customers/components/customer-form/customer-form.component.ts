import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customer?: Customer;
  loading = false;

  genders = ['MALE', 'FEMALE', 'OTHER'];
  skinTypes = ['NORMAL', 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE'];
  hairTypes = ['NORMAL', 'DRY', 'OILY', 'DAMAGED', 'COLORTREATED'];
  membershipLevels = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\+\-\(\)]{10,}$/)]],
      email: ['', [Validators.email]],
      birthDate: [null],
      gender: [null],
      address: [''],
      skinType: [null],
      hairType: [null],
      membershipLevel: ['BRONZE'],
      allergies: [''],
      isActive: [true],
      totalVisits: [0],
      totalSpent: [0]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.customerService.getCustomer(+id).subscribe({
        next: (customer) => {
          if (!customer) {
            this.snackBar.open(
              this.translate.instant('common.errors.notFound'),
              this.translate.instant('common.close'),
              { duration: 3000 }
            );
            this.router.navigate(['/customers']);
            return;
          }
          this.customer = customer;
          this.customerForm.patchValue({
            ...customer,
            allergies: customer.allergies?.join(', ') || ''
          });
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            this.translate.instant('common.errors.loadFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/customers']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true;
      const formValue = this.customerForm.value;
      
      const customerData = {
        ...formValue,
        allergies: formValue.allergies ? formValue.allergies.split(',').map((a: string) => a.trim()) : [],
        createdAt: this.customer?.createdAt || new Date(),
        updatedAt: new Date()
      } as Customer;

      const operation = this.customer
        ? this.customerService.updateCustomer({ ...customerData, id: this.customer.id })
        : this.customerService.createCustomer(customerData);

      operation.subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open(
            this.translate.instant(this.customer ? 'common.updateSuccess' : 'common.createSuccess'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            this.translate.instant('common.errors.saveFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }

  get formControls(): { [key: string]: any } {
    return this.customerForm.controls;
  }

  addAllergy(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      const allergies = this.customerForm.get('allergies')?.value || [];
      this.customerForm.patchValue({
        allergies: [...allergies, value]
      });
      event.chipInput!.clear();
    }
  }

  removeAllergy(allergy: string): void {
    const allergies = this.customerForm.get('allergies')?.value || [];
    this.customerForm.patchValue({
      allergies: allergies.filter((a: string) => a !== allergy)
    });
  }
} 