import { Injectable, EventEmitter } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Login, ILoginResult } from "src/app/models/login";
import { Observable, throwError } from "rxjs";
import { tap, shareReplay, catchError } from "rxjs/operators";

import * as moment from "moment";
import { ISignUp, ISignUpResult } from "src/app/models/signup";
import { IVerify, IVerifyResult } from "src/app/models/verify";
import { User } from "src/app/models/user";
import { IEmail, IEmailResult } from "src/app/models/email";
import {
  IPasswordResetEmail,
  IPasswordResetEmailResult,
  IPasswordReset,
  IPasswordResetResult
} from "src/app/models/password-reset";

@Injectable({
  providedIn: "root"
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
  constructor(private httpClient: HttpClient) {}

  /**
   * Send the login request to server for token
   *
   * @param {Login} cred
   * @returns {Observable<String>}
   * @memberof LoginService
   */
  public login(cred: Login): Observable<ILoginResult> {
    return this.httpClient
      .post<ILoginResult>(`${this.url}api/account/authenticate`, cred)
      .pipe(
        tap(this.setSession),
        tap(res => this.setUserWithLogin(res))
      );
  }

  public signUp(cred: ISignUp): Observable<ISignUpResult> {
    return this.httpClient
      .post<ISignUpResult>(`${this.url}api/account/register`, cred)
      .pipe(tap(res => this.setUserWithSignUp(res)));
  }

  public verifyEmail(data: IVerify, token: string): Observable<IVerifyResult> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    return this.httpClient.post<IVerifyResult>(
      `${this.url}api/account/verifyemail`,
      data,
      { headers: headers }
    );
  }

  public sendEmail(email: string): Observable<IEmailResult> {
    const data: IEmail = {
      emailTo: email
    };
    return this.httpClient.post<IEmailResult>(
      `${this.url}api/account/sendverification`,
      data
    );
  }

  public sendResetPasswordEmail(
    email: string
  ): Observable<IPasswordResetEmailResult> {
    const data: IPasswordResetEmail = {
      emailTo: email
    };
    return this.httpClient.post<IPasswordResetEmailResult>(
      `${this.url}api/account/sendpasswordreset`,
      data
    );
  }

  public resetPassword(
    data: IPasswordReset,
    token: string
  ): Observable<IPasswordResetResult> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    return this.httpClient.post<IPasswordResetResult>(
      `${this.url}api/account/resetpassword`,
      data,
      { headers: headers }
    );
  }

  /**
   * Logout from the application
   *
   * @memberof LoginService
   */
  public logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
    localStorage.removeItem("user");
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
      localStorage.setItem("token", loginResult.token);
    }
    if (loginResult.expire) {
      localStorage.setItem("expire", loginResult.expire.toString());
    }
  }

  public setUserWithLogin(response: ILoginResult): void {
    const user: User = {
      emailAddress: response.emailAddress,
      firstName: response.firstName,
      lastName: response.lastName,
      emailVerified: response.emailVerified,
      token: response.token,
      follow: response.follow,
      role: response.role,
      userId: response.userId
    };
    this.user = new User(user);
    localStorage.setItem("user", JSON.stringify(this.user));
    this.logInOutEmitter.emit(true);
  }

  public setUserWithSignUp(response: ISignUpResult): void {
    const user: User = {
      userId: response.userId,
      emailAddress: response.emailAddress,
      firstName: response.firstName,
      lastName: response.lastName,
      emailVerified: response.emailVerified
    };
    this.user = new User(user);
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
    const expiration = localStorage.getItem("expire");
    return moment(expiration);
  }

  getUser() {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return user;
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
