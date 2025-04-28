import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { LanguageService } from './core/services/language.service';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ColorStudio';
  isSidenavOpen = true;
  currentRoute = '';
  isAuthenticated = false;

  menuItems = [
    { path: '/home', icon: 'home', label: 'menu.home' },
    { path: '/dashboard', icon: 'dashboard', label: 'menu.dashboard' },
    { path: '/customers', icon: 'people', label: 'menu.customers' },
    { path: '/colors', icon: 'palette', label: 'menu.colors' },
    { path: '/beauty-services', icon: 'spa', label: 'menu.beautyServices' },
    { path: '/appointments', icon: 'event', label: 'menu.appointments' }
  ];

  constructor(
    public router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private authService: AuthService,
    private titleService: Title
  ) {
    // Initialize languages
    this.translate.addLangs(['fa', 'en']);
    this.languageService.initializeLanguage();

    // Subscribe to authentication state changes
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });

    // Set initial title
    this.updateTitle();
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.updateTitle();
    });

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(() => {
      this.updateTitle();
    });
  }

  private updateTitle() {
    const baseTitle = 'ColorStudio';
    if (this.currentRoute === '/') {
      this.titleService.setTitle(baseTitle);
    } else {
      const routeKey = this.currentRoute.split('/')[1];
      if (routeKey) {
        this.translate.get(`menu.${routeKey}`).subscribe(translatedRoute => {
          this.titleService.setTitle(`${translatedRoute} | ${baseTitle}`);
        });
      }
    }
  }

  switchLanguage(lang: string): void {
    this.languageService.switchLanguage(lang);
  }

  toggleSidenav(sidenav: MatSidenav): void {
    sidenav.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 