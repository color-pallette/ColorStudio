import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('');
  currentLanguage$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Initialize with current language
    this.languageSubject.next(this.translate.currentLang);

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      this.languageSubject.next(event.lang);
      this.updateDocumentDirection(event.lang);
    });
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  initializeLanguage(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = 'fa';
    
    const lang = savedLang || (browserLang?.match(/fa|en/) ? browserLang : defaultLang);
    
    this.translate.setDefaultLang(defaultLang);
    this.switchLanguage(lang);
    this.updateDocumentDirection(lang);
  }

  private updateDocumentDirection(lang: string): void {
    const isRtl = lang === 'fa';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // Force update of all Material components
    window.dispatchEvent(new Event('resize'));
  }
} 