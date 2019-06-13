import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Login, ILoginResult } from 'src/app/models/login';
import { Observable, throwError } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';

import * as moment from 'moment';
import { ISignUp, ISignUpResult } from 'src/app/models/signup';
import { IVerify, IVerifyResult } from 'src/app/models/verify';
import { User } from 'src/app/models/user';
import { IEmail, IEmailResult } from 'src/app/models/email';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /** Login url  */
  private url = environment.server;

  /** Emitter to emit login and logout success*/
  private logInOutEmitter: EventEmitter<boolean> = new EventEmitter();

  public user: User;

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
        tap(this.setUserWithLogin)
      )
  }

  public signUp(cred: ISignUp): Observable<ISignUpResult> {
    return this.httpClient.post<ISignUpResult>(`${this.url}api/account/register`, cred)
      .pipe(
        tap(this.setUserWithSignUp)
      );
  }

  public verifyEmail(data: IVerify, token: string): Observable<IVerifyResult> {
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token)});  
    return this.httpClient.post<IVerifyResult>(`${this.url}api/account/verifyemail`, data, {headers: headers});
  }

  public sendEmail(email:string): Observable<IEmailResult> {
    const data: IEmail = {
      emailTo: email
    }
    return this.httpClient.post<IEmailResult>(`${this.url}api/account/sendverification`, data);
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

  public setUserWithLogin(response: ILoginResult): void {
    const user : User = {
      emailAddress: response.emailAddress,
      firstName: response.firstName,
      lastName: response.lastName,
      emailVerified: response.emailVerified
    }
    this.user  = new User(user);
  }

  public setUserWithSignUp(response: ISignUpResult): void {
    const user : User = {
      userId: response.userId,
      emailAddress: response.emailAddress,
      firstName: response.firstName,
      lastName: response.lastName,
      emailVerified: response.emailVerified
    }
    this.user  = new User(user);
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
