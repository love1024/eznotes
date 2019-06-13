import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  email: string = '';

  errors = [];

  constructor(private loginService: LoginService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(): void {
    if(!this.email) {
      return;
    }

    this.errors = [];
    this.spinner.show();
    this.loginService.sendResetPasswordEmail(this.email).subscribe((res) => {
      this.spinner.hide();
      this.router.navigateByUrl('/reset');
    },(err) => {
      this.spinner.hide();
      if(err.error) {
        this.errors = err.error.message;
      }
    });
  }
}
