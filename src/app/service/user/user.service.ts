import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginService } from "../login/login.service";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User, IUser } from "src/app/models/user";

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
}
