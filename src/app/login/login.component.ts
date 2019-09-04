import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../service/login/login.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ILoginResult } from '../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  showError = false;

  errors = [];

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    
    this.loginForm = this.fb.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showError = false;
    this.spinner.show();
    this.errors = [];
    this.loginService.login(this.loginForm.value).subscribe((res: ILoginResult) => {
      this.spinner.hide();
      if(!res.emailVerified) {
        this.router.navigateByUrl('/verify');
      } else if(!res.passwordChanged) {
        this.router.navigateByUrl('/reset');
      } else {
        this.loginService.emitLogInOut();
        this.router.navigateByUrl('/home');
      }
    }, (err) => {
      this.spinner.hide();
      this.errors = err.error.message;
    });
  }

  onKeydown(event) {
    if(event.key == "Enter") {
      this.onSubmit();
    }
  }
}
