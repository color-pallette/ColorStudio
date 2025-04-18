import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LanguageService } from '../../core/services/language.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Statistics
  totalCustomers = 0;
  totalAppointments = 0;
  totalRevenue = 0;
  totalServices = 0;

  // Recent Appointments
  recentAppointments: any[] = [];
  appointmentsDataSource: MatTableDataSource<any>;
  displayedAppointmentColumns: string[] = ['customer', 'service', 'date', 'status'];

  // Popular Services
  popularServices: any[] = [];
  servicesDataSource: MatTableDataSource<any>;
  displayedServiceColumns: string[] = ['name', 'category', 'bookings', 'revenue'];

  @ViewChild('appointmentsPaginator') appointmentsPaginator!: MatPaginator;
  @ViewChild('servicesPaginator') servicesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.appointmentsDataSource = new MatTableDataSource();
    this.servicesDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadDashboardData();

    // Subscribe to language changes
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setupPaginatorTranslations();
        // Force table refresh
        this.appointmentsDataSource.data = [...this.recentAppointments];
        this.servicesDataSource.data = [...this.popularServices];
      });
  }

  ngAfterViewInit(): void {
    this.setupPaginatorTranslations();
    
    // Setup appointments table
    this.appointmentsDataSource.paginator = this.appointmentsPaginator;
    this.appointmentsDataSource.sort = this.sort;

    // Setup services table
    this.servicesDataSource.paginator = this.servicesPaginator;
    this.servicesDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupPaginatorTranslations(): void {
    if (this.appointmentsPaginator && this.servicesPaginator) {
      this.translate.stream('common.pagination')
        .pipe(takeUntil(this.destroy$))
        .subscribe(translations => {
          // Setup translations for appointments paginator
          this.appointmentsPaginator._intl.itemsPerPageLabel = translations.itemsPerPage;
          this.appointmentsPaginator._intl.nextPageLabel = translations.nextPage;
          this.appointmentsPaginator._intl.previousPageLabel = translations.previousPage;
          this.appointmentsPaginator._intl.firstPageLabel = translations.firstPage;
          this.appointmentsPaginator._intl.lastPageLabel = translations.lastPage;
          this.appointmentsPaginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
              return this.translate.instant('common.noData');
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return this.translate.instant('common.pagination.rangeLabel', { startIndex: startIndex + 1, endIndex, length });
          };

          // Setup translations for services paginator
          this.servicesPaginator._intl.itemsPerPageLabel = translations.itemsPerPage;
          this.servicesPaginator._intl.nextPageLabel = translations.nextPage;
          this.servicesPaginator._intl.previousPageLabel = translations.previousPage;
          this.servicesPaginator._intl.firstPageLabel = translations.firstPage;
          this.servicesPaginator._intl.lastPageLabel = translations.lastPage;
          this.servicesPaginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
              return this.translate.instant('common.noData');
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return this.translate.instant('common.pagination.rangeLabel', { startIndex: startIndex + 1, endIndex, length });
          };

          // Force paginators to update
          this.appointmentsPaginator._changePageSize(this.appointmentsPaginator.pageSize);
          this.servicesPaginator._changePageSize(this.servicesPaginator.pageSize);
        });
    }
  }

  loadDashboardData(): void {
    // TODO: Implement API calls to load dashboard data
    // For now, using mock data
    this.totalCustomers = 150;
    this.totalAppointments = 45;
    this.totalRevenue = 12500;
    this.totalServices = 25;

    this.recentAppointments = [
      { id: 1, customer: 'John Doe', service: 'Hair Color', date: new Date(), status: 'Scheduled' },
      { id: 2, customer: 'Jane Smith', service: 'Manicure', date: new Date(), status: 'Completed' },
      { id: 3, customer: 'Mike Johnson', service: 'Facial', date: new Date(), status: 'Cancelled' }
    ];

    this.popularServices = [
      { id: 1, name: 'Hair Color', category: 'hair', bookings: 120, revenue: 4800 },
      { id: 2, name: 'Manicure', category: 'nails', bookings: 95, revenue: 2850 },
      { id: 3, name: 'Facial', category: 'skin', bookings: 80, revenue: 3200 }
    ];

    this.appointmentsDataSource.data = this.recentAppointments;
    this.servicesDataSource.data = this.popularServices;
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'status-scheduled';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
} 