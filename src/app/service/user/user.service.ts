import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginService } from "../login/login.service";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User, IUser } from "src/app/models/user";
import { IFollow } from "src/app/models/follow";
import { IContactUs } from "src/app/models/IContactUs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  api: string = environment.server;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  getAllInstitutes(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.api}api/user/all/institutes`);
  }

  getAllProfessors(instituteId: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      `${this.api}api/user/all/professors?instituteId=${instituteId}`
    );
  }

  getUserInfo(userId): Observable<IUser> {
    return this.http.get<IUser>(`${this.api}api/user/info?userId=${userId}`);
  }

  getUserInfoByEmail(email): Promise<IUser> {
    return this.http
      .get<IUser>(`${this.api}api/user/infobyemail?email=${email}`)
      .toPromise();
  }

  followProfessors(input: IFollow): Observable<void> {
    const user = this.loginService.getUser();
    return this.http.post<void>(
      `${this.api}api/user/follow?userId=${user.userId}`,
      input
    );
  }

  contactUs(input: IContactUs): Observable<void> {
    return this.http.post<void>(`${this.api}api/account/contactus`, input);
  }
}
