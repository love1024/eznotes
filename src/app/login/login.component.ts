import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../service/login/login.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  showError = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showError = false;
    this.spinner.show();
    this.loginService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.type === 'fail') {
        this.showError = true;
      } else {
        this.loginService.emitLogInOut();
        this.showError = false;
        this.router.navigateByUrl('/home');
      }
      this.spinner.hide();
    });
  }
}
