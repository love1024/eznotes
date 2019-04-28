import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  summaryUrl = environment.SummaryUrl;
  qaSummaryUrl = environment.QaSummaryUrl;

  constructor(private http: HttpClient) { }

  queryText(payload: any): Observable<any> {
    return this.http.post(this.qaSummaryUrl, payload);
  }

  summaryText(payload: any): Observable<any> {
    return this.http.post(this.summaryUrl, payload);
  }
}
