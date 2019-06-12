import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login, ILoginResult } from 'src/app/models/login';
import { Observable, throwError } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';

import * as moment from 'moment';
import { ISignUp } from 'src/app/models/signup';
import { IVerify, IVerifyResult } from 'src/app/models/verify';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /** Login url  */
  private url = environment.server;

  /** Emitter to emit login and logout success*/
  private logInOutEmitter: EventEmitter<boolean> = new EventEmitter();

  /**
   * Creates an instance of LoginService.
   * @param {HttpClient} httpClient 
   * @memberof LoginService
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Send the login request to server for token
   * 
   * @param {Login} cred 
   * @returns {Observable<String>} 
   * @memberof LoginService
   */
  public login(cred: Login): Observable<ILoginResult> {
    return this.httpClient.post<ILoginResult>(`${this.url}api/account/authenticate`, cred)
      .pipe(
        tap(this.setSession),
        shareReplay()
      )
  }

  public signUp(cred: ISignUp): Observable<ISignUp> {
    return this.httpClient.post<ISignUp>(`${this.url}api/account/register`, cred);
  }

  public verifyEmail(data: IVerify): Observable<IVerifyResult> {
    return this.httpClient.post<IVerifyResult>(`${this.url}api/account/verify`, data);
  }

  /**
   * Logout from the application
   * 
   * @memberof LoginService
   */
  public logout() {
    localStorage.removeItem('token');
  }

  /**
   * Change password of given id
   * 
   * @param {number} id 
   * @param {*} data 
   * @returns 
   * @memberof LoginService
   */
  public changePassword(id: number, data: any) {
    const url = this.url + "/" + id;
    return this.httpClient.post(url, data);
  }

  /**
   * Set the token to localstorage
   * 
   * @param {any} loginResult 
   * @memberof LoginService
   */
  public setSession(loginResult: ILoginResult) {
    if (loginResult.token) {
      localStorage.setItem('token', loginResult.token);
    }
  }

  /**
   * Check if user is logged in
   * 
   * @returns 
   * @memberof LoginService
   */
  public isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * Check if user is logged out
   * 
   * @returns 
   * @memberof LoginService
   */
  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  /**
   * Get Login Success Emitter
   * 
   * @returns 
   * @memberof LoginService
   */
  public getLogInOutEmitter() {
    return this.logInOutEmitter;
  }

  /**
   * Emit Login success
   * 
   * @memberof LoginService
   */
  public emitLogInOut() {
    this.logInOutEmitter.emit(this.isLoggedIn());
  }

  /**
   * Log any server error
   * 
   * @param {HttpErrorResponse} err 
   * @returns {Observable<any>} 
   * @memberof LoginService
   */
  handleError(err: HttpErrorResponse): Observable<any> {
    throw throwError(err);
  }

}
