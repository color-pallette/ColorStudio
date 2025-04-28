import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }

  uploadBase64Image(base64Image: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-base64`, { image: base64Image });
  }
} 