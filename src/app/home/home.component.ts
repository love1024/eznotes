import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  isLogIn() {
    return this.loginService.isLoggedIn();
  }

}
