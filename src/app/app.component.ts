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
  collapsed = true;

  isLoggedIn = false;

  constructor(public route: ActivatedRoute, private loginService: LoginService){}

  ngOnInit(){
    this.loginService.getLogInOutEmitter().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  setRouter(name) {
    if (name === 'pricing' || name === 'blog' || name === 'contact') {
      this.showFooter = false;
    } else {
      this.showFooter = true;
    }
    this.toggleCollapsed();
  }

  logout() {
    this.loginService.logout();
    this.loginService.emitLogInOut();
    this.setRouter('login');
  }


  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
