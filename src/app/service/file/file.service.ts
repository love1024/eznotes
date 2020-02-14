import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LoginService } from "../login/login.service";
import { switchMap } from "rxjs/operators";
import { IFile } from "src/app/models/fileitem";

@Injectable({
  providedIn: "root"
})
export class FileService {
  api: string = environment.server;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  /**
   * Upload file to server
   *
   * @param {FormData} data
   * @returns {Observable<void>}
   * @memberof FileService
   */
  uploadFile(data): Observable<void> {
    const user = this.loginService.getUser() || {};
    return this.http.post<void>(
      `${this.api}api/file/upload?email=${user.emailAddress}`,
      data
    );
  }

  uploadFileWithText(file: IFile): Observable<void> {
    const user = this.loginService.getUser() || {};
    return this.http.post<void>(
      `${this.api}api/file/uploadtext?email=${user.emailAddress}`,
      file
    );
  }

  getFiles(): Observable<any> {
    const user = this.loginService.getUser() || {};
    return this.http.get<any>(
      `${this.api}api/file/files?userId=${user.userId}`
    );
  }

  getFileUrl(name: string): Observable<any> {
    return this.http.get<any>(`${this.api}api/file/fileurl?filename=${name}`);
  }

  downloadCaptionFile(file: FormData, filename: string) {
    this.http
      .post<any>(`${this.api}api/file/caption?filename=${filename}`, file)
      .subscribe(res => {
        window.open(res.url, "__blank");
      });
  }

  deleteFile(id: number): Observable<void> {
    return this.http.get<void>(`${this.api}api/file/delete?id=${id}`);
  }

  updateFile(file: IFile, email: string): Observable<void> {
    return this.http.post<void>(
      `${this.api}api/file/update?email=${email}`,
      file
    );
  }

  updateFileUse(file: IFile, email: string): Observable<void> {
    return this.http.post<void>(
      `${this.api}api/file/updateuse?email=${email}`,
      file
    );
  }

  changeName(data, fileId): Observable<void> {
    return this.http.post<void>(
      `${this.api}api/file/filename?fileId=${fileId}`,
      data
    );
  }

  getFile(name: string, email: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}api/file/file?filename=${name}&email=${email}`
    );
  }

  checkNewFile(email: string): Observable<any> {
    return this.http.get<any>(`${this.api}api/file/alert?email=${email}`);
  }

  updateStatusForUser(data): Observable<void> {
    return this.http.post<void>(`${this.api}api/file/alert`, data);
  }

  changeFileText(data, filename, email): Observable<void> {
    return this.http.post<void>(
      `${this.api}api/file/changeFileText?filename=${filename}&email=${email}`,
      data
    );
  }
}
