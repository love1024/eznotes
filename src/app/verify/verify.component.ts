import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../service/login/login.service';
import { IVerify } from '../models/verify';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private loginService: LoginService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const email = params.email;
      const token = params.token;
      if(email && token) {
        this.verifyEmail(email,token);
      }
    });
  }

  verifyEmail(email, token): void {
    const data: IVerify = {
      emailAddress: email,
      token: token
    }
    this.loginService.verifyEmail(data).subscribe((res) => {
      console.log(res);
    });
  }
}
