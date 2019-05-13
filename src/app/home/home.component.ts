import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getLogInOutEmitter().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

}
