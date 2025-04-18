import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Color, ColorCategory } from '../../models/color.model';
import { ColorService } from '../../colors/services/color.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  colors: Color[] = [];
  loading = false;
  error = '';
  selectedCategory: ColorCategory | null = null;
  categories = Object.values(ColorCategory);

  constructor(
    private router: Router,
    private colorService: ColorService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadColors(null);
  }

  loadColors(category: ColorCategory | null) {
    this.loading = true;
    this.colorService.getColors(category)
      .subscribe({
        next: (colors) => {
          this.colors = colors;
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  filterByCategory(category: ColorCategory | null) {
    this.selectedCategory = category;
    this.loadColors(category);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
} 