import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from 'src/app/models/login';
import { Observable, throwError } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';

import * as moment from 'moment';
import { SignUp } from 'src/app/models/signup';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /** Login url  */
  private url = environment.server;

  /** Manager Id */
  private managerId: number;

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
  public login(cred: Login): Observable<String> {
    return this.httpClient.post<String>(`${this.url}login`, cred)
      .pipe(
        tap(this.setSession),
        shareReplay(),
        catchError(this.handleError)
      )
  }

  public signUp(cred: SignUp): Observable<String> {
    return this.httpClient.post<String>(`${this.url}login/signup`, cred);
  }

  /**
   * Logout from the application
   * 
   * @memberof LoginService
   */
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('resourceId');
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
  public setSession(loginResult) {
    if (loginResult.token) {
      const expiresAt = moment().add(loginResult.expiresIn, 'second');
      localStorage.setItem('resourceId', loginResult.resourceId);
      localStorage.setItem('token', loginResult.token);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }
  }

  /**
   * Check if user is logged in
   * 
   * @returns 
   * @memberof LoginService
   */
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
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
   * Get the current logged in 
   * manager
   * @returns 
   * @memberof LoginService
   */
  public getManagerId() {
    return parseInt(localStorage.getItem("resourceId") || "-1");
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
   * Get expiration time of token
   * 
   * @returns 
   * @memberof LoginService
   */
  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  /**
   * Log any server error
   * 
   * @param {HttpErrorResponse} err 
   * @returns {Observable<any>} 
   * @memberof LoginService
   */
  handleError(err: HttpErrorResponse): Observable<any> {
    console.log(err);
    throw throwError(err);
  }

}
