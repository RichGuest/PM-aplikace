import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://streaming-availability.p.rapidapi.com/search/title';
  private apiKey = '77b34dc3f2msha955cd03644009bp1e5485jsn625049586217'; 

  constructor(private http: HttpClient) { }

  getData(title: string, contentType: string, year: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    });

    const params = new HttpParams({
      fromObject: {
        title: title,
        country: 'us',
        type: contentType, 
        output_language: 'en',
      }
    });
    
    return this.http.get(this.apiUrl, { headers, params });
  }
}
