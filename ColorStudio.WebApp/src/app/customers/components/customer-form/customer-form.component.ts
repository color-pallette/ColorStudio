import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customer: any;
  loading = false;

  genders = ['male', 'female', 'other'];
  skinTypes = ['normal', 'dry', 'oily', 'combination', 'sensitive'];
  hairTypes = ['normal', 'dry', 'oily', 'damaged', 'colortreated'];
  membershipLevels = ['regular', 'silver', 'gold', 'platinum'];

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
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\+\-\(\)]{10,}$/)]],
      email: ['', [Validators.email]],
      birthDate: [null],
      gender: [null],
      address: [''],
      skinType: [null],
      hairType: [null],
      membershipLevel: ['regular'],
      allergies: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.customerService.getCustomer(id).subscribe({
        next: (customer) => {
          this.customer = customer;
          this.customerForm.patchValue(customer);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            this.translate.instant('customer.errors.loadFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true;
      const customerData = this.customerForm.value;
      
      const operation = this.customer
        ? this.customerService.updateCustomer(this.customer.id, customerData)
        : this.customerService.createCustomer(customerData);

      operation.subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open(
            this.translate.instant(this.customer ? 'customer.updateSuccess' : 'customer.createSuccess'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            this.translate.instant('customer.errors.saveFailed'),
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