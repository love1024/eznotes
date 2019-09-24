import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  summaryUrl = environment.SummaryUrl;
  qaSummaryUrl = environment.QaSummaryUrl;

  public textEmitter: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { 
  }

  queryText(payload: any): Observable<any> {
    return this.http.post(this.qaSummaryUrl, payload);
  }

  summaryText(payload: any): Observable<any> {
    return this.http.post(this.summaryUrl, payload);
  }
}
