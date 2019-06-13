import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../service/login/login.service';
import { IVerify } from '../models/verify';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  email: string = '';

  isVerifying: boolean = true;

  isVerified: boolean = false;

  errors = [];

  constructor(private route: ActivatedRoute, private loginService: LoginService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if(this.loginService.user) {
      this.email = this.loginService.user.emailAddress;
    }
    this.route.queryParams.subscribe((params) => {
      const email = params.email;
      const token = params.code;
      if(email && token) {
        this.isVerifying = true;
        this.verifyEmail(email,token);
      } else {
        this.isVerifying = false;
      }
    });

  }

  verifyEmail(email:string, token:string): void {
    const data: IVerify = {
      emailAddress: email
    }
    this.spinner.show();
    this.loginService.verifyEmail(data,token).subscribe((res) => {
      this.spinner.hide();
      this.isVerified = true;
    },(err) => {
      this.spinner.hide();
      if(err.error) {
        this.errors = err.error.message;
      }
    });
  }

  sendEmail(email: string): void {

  }
}
