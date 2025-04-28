import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected http: HttpClient;
  protected apiUrl: string = '';

  constructor(http: HttpClient) {
    this.http = http;
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  protected post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  protected put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(
      catchError(this.handleError)
    );
  }
} 