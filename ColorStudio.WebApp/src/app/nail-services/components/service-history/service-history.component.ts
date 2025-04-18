import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NailServiceService } from '../../services/nail-service.service';
import { NailServiceHistory } from '../../../models/nail-service.model';

@Component({
  selector: 'app-service-history',
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss']
})
export class ServiceHistoryComponent implements OnInit {
  displayedColumns: string[] = ['serviceDate', 'customerName', 'price', 'rating', 'notes'];
  dataSource: MatTableDataSource<NailServiceHistory>;
  serviceId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nailService: NailServiceService,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['serviceId']) {
        this.serviceId = +params['serviceId'];
        this.loadServiceHistory();
      } else {
        this.router.navigate(['/nail-services']);
      }
    });
  }

  private loadServiceHistory(): void {
    this.nailService.getServiceHistory(this.serviceId).subscribe(history => {
      this.dataSource.data = history;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goBack(): void {
    this.router.navigate(['/nail-services']);
  }
} 