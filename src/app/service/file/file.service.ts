import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  api: string = environment.server;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  /**
   * Upload file to server
   *
   * @param {FormData} data
   * @returns {Observable<void>}
   * @memberof FileService
   */
  uploadFile(data): Observable<void> {
    const user = this.loginService.getUser() || {};
    return this.http.post<void>(`${this.api}api/file/upload?email=${user.emailAddress}`, data);
  }
}
