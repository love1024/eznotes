import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../service/login/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IPasswordReset } from '../models/password-reset';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  isChanging: boolean = true;

  isChanged: boolean = false;

  email: string;

  password: string;

  token: string;

  errors = [];

  constructor(private route: ActivatedRoute, private loginService: LoginService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params.email;
      this.token = params.code;
      if(this.email && this.token) {
        this.isChanging = true;
      } else {
        this.isChanging = false;
      }
    });
  }

  changePassword(): void {
    const data: IPasswordReset = {
      emailAddress: this.email,
      newPassword: this.password
    }
    this.errors = [];
    this.spinner.show();
    this.loginService.resetPassword(data,this.token).subscribe((res) => {
      this.spinner.hide();
      this.isChanged = true;
      this.isChanging = false;
    },(err) => {
      this.spinner.hide();
      if(err.error) {
        this.errors = err.error.message;
      }
    });
  }
}
