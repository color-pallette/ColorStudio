import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'membershipLevel',
    'totalVisits',
    'lastVisitDate',
    'isActive',
    'actions'
  ];
  dataSource: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource<Customer>();
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom sort for dates
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch(property) {
        case 'lastVisitDate': return new Date(item.lastVisitDate);
        default: return item[property];
      }
    };
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (customers) => {
        this.dataSource.data = customers;
      },
      (error) => {
        console.error('Error loading customers:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCustomer(): void {
    this.router.navigate(['/customers/add']);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  viewCustomer(id: number): void {
    this.router.navigate(['/customers', id]);
  }

  deleteCustomer(id: number): void {
    if (confirm(this.translate.instant('customer.confirmDelete'))) {
      this.customerService.deleteCustomer(id).subscribe(
        () => {
          this.loadCustomers();
        },
        (error) => {
          console.error('Error deleting customer:', error);
        }
      );
    }
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'active-status' : 'inactive-status';
  }
}