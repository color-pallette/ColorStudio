import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ColorService } from '../../services/color.service';
import { Color, ColorCategory, ColorCategoryModel } from '../../../models/color.model';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'code', 'hexCode', 'brandName', 'categoryName', 'inStock', 'actions'];
  dataSource: MatTableDataSource<Color>;
  ColorCategory = ColorCategory;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private colorService: ColorService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadColors();
    this.setupPaginatorTranslations();
  }

  setupPaginatorTranslations(): void {
    this.translate.stream('common.pagination').subscribe(translations => {
      this.paginator._intl.itemsPerPageLabel = translations.itemsPerPage;
      this.paginator._intl.nextPageLabel = translations.nextPage;
      this.paginator._intl.previousPageLabel = translations.previousPage;
      this.paginator._intl.firstPageLabel = translations.firstPage;
      this.paginator._intl.lastPageLabel = translations.lastPage;
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return this.translate.instant('common.noData');
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return this.translate.instant('common.pagination.rangeLabel', { startIndex: startIndex + 1, endIndex, length });
      };
    });
  }

  loadColors(): void {
    this.colorService.getColors().subscribe(colors => {
      this.dataSource.data = colors.map(color => ({
        ...color,
        categoryName: typeof color.categoryName === 'object' ? (color.categoryName as ColorCategoryModel).name : color.categoryName
      }));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editColor(id: number): void {
    this.router.navigate(['/colors/edit', id]);
  }

  deleteColor(id: number): void {
    if (confirm(this.translate.instant('color.confirmDelete'))) {
      this.colorService.deleteColor(id).subscribe(() => {
        this.loadColors();
      });
    }
  }

  addNewColor(): void {
    this.router.navigate(['/colors/new']);
  }

  viewColorDetails(id: number): void {
    this.router.navigate(['/colors', id]);
  }
} 