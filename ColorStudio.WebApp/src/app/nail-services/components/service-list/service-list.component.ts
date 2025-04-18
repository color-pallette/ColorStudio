import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NailServiceService } from '../../services/nail-service.service';
import { NailService } from '../../../models/nail-service.model';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price', 'duration', 'isActive', 'actions'];
  dataSource: MatTableDataSource<NailService>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private nailService: NailServiceService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.nailService.getServices().subscribe(services => {
      this.dataSource.data = services;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editService(id: number): void {
    this.router.navigate(['/nail-services/edit', id]);
  }

  deleteService(id: number): void {
    if (confirm(this.translate.instant('NAIL_SERVICES.CONFIRM_DELETE'))) {
      this.nailService.deleteService(id).subscribe(() => {
        this.loadServices();
      });
    }
  }

  addNewService(): void {
    this.router.navigate(['/nail-services/new']);
  }

  viewHistory(id: number): void {
    this.router.navigate(['/nail-services/history'], { queryParams: { serviceId: id } });
  }
} 