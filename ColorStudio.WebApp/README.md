# ColorStudio Web Application

## توضیحات
ColorStudio یک نرم‌افزار مدیریت سالن زیبایی است که با تمرکز بر مدیریت رنگ‌های لاک ناخن و خدمات زیبایی طراحی شده است. این نرم‌افزار با استفاده از Angular 15 و Material Design پیاده‌سازی شده و از زبان‌های فارسی و انگلیسی پشتیبانی می‌کند.

### امکانات
- مدیریت رنگ‌های لاک ناخن
- مدیریت مشتریان
- مدیریت خدمات زیبایی
- پشتیبانی از دو زبان فارسی و انگلیسی
- رابط کاربری زیبا و واکنش‌گرا
- پشتیبانی از RTL

## نصب و راه‌اندازی
```bash
# نصب وابستگی‌ها
npm install

# اجرای نرم‌افزار در محیط توسعه
npm start

# ساخت نسخه تولید
npm run build
```

## English Description

ColorStudio is a beauty salon management application focused on nail polish color management and beauty services. Built with Angular 15 and Material Design, it supports both Persian and English languages.

### Features
- Nail polish color management
- Customer management
- Beauty services management
- Bilingual support (Persian/English)
- Beautiful responsive UI
- RTL support

## Installation and Setup
```bash
# Install dependencies
npm install

# Run development server
npm start

# Build production version
npm run build
```

## Technical Stack
- Angular 15.2.0
- Angular Material
- NgRx for state management
- @ngx-translate for internationalization
- RxJS for reactive programming
- TypeScript for type safety

## Project Structure
```
src/
├── app/
│   ├── auth/           # Authentication module
│   ├── home/           # Home module
│   ├── colors/         # Colors management
│   ├── customers/      # Customer management
│   ├── services/       # Beauty services
│   └── shared/         # Shared components
├── assets/
│   ├── i18n/          # Translation files
│   └── images/        # Images and icons
└── environments/      # Environment configurations
``` 