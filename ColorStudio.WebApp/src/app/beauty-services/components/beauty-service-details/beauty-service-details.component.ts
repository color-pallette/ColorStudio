import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDetails } from '../../../shared/models/beauty-service.model';
import { BeautyServiceService } from '../../../shared/services/beauty-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-beauty-service-details',
  templateUrl: './beauty-service-details.component.html',
  styleUrls: ['./beauty-service-details.component.scss']
})
export class BeautyServiceDetailsComponent implements OnInit {
  service: ServiceDetails | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beautyService: BeautyServiceService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadServiceDetails(+serviceId);
    } else {
      this.router.navigate(['/beauty-services']);
    }
  }

  loadServiceDetails(id: number): void {
    this.loading = true;
    this.beautyService.getService(id).subscribe({
      next: (service) => {
        this.service = {
          ...service,
          averageRating: 0,
          totalBookings: 0,
          lastBookingDate: undefined,
          requirements: [],
          benefits: [],
          preparationNotes: '',
          aftercareInstructions: ''
        } as ServiceDetails;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading service details:', error);
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