import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './service/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'liivlabs';
  showFooter = true;

  isLoggedIn = false;

  constructor(public route: ActivatedRoute, private loginService: LoginService){}

  ngOnInit(){
    this.loginService.getLogInOutEmitter().subscribe((loggedIn) => {
      console.log(loggedIn);
      this.isLoggedIn = loggedIn;
    });
  }

  setRouter(name) {
    if (name === 'pricing' || name === 'blog' || name === 'contact') {
      this.showFooter = false;
    } else {
      this.showFooter = true;
    }
  }

  logout() {
    this.loginService.logout();
    this.loginService.emitLogInOut();
    this.setRouter('login');
  }
}
