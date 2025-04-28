import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { BeautyService, ServiceType } from '../../../shared/models/beauty-service.model';
import { BeautyServiceService } from '../../services/beauty-service.service';

@Component({
  selector: 'app-beauty-service-list',
  templateUrl: './beauty-service-list.component.html',
  styleUrls: ['./beauty-service-list.component.scss']
})
export class BeautyServiceListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'price', 'duration', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<BeautyService>();
  serviceTypes = ServiceType;
  allServices: BeautyService[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private beautyService: BeautyServiceService,
    private router: Router,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadServices(): void {
    this.beautyService.getServices().subscribe({
      next: (services) => {
        this.allServices = services;
        this.dataSource.data = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.snackBar.open(
          this.translate.instant('common.errors.loadFailed'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByType(event: MatSelectChange): void {
    const type = event.value;
    if (!type) {
      this.dataSource.data = this.allServices;
    } else {
      this.dataSource.data = this.allServices.filter(service => service.type === type);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteService(id: number): void {
    if (confirm(this.translate.instant('common.confirmDelete'))) {
      this.beautyService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
          this.snackBar.open(
            this.translate.instant('common.deleteSuccess'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.snackBar.open(
            this.translate.instant('common.errors.deleteFailed'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  viewService(id: number): void {
    this.router.navigate(['/beauty-services/details', id]);
  }

  editService(id: number): void {
    this.router.navigate(['/beauty-services/edit', id]);
  }
} 