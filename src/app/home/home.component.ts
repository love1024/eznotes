import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private loginService: LoginService,private router : Router) { }

  ngOnInit() {
  }

  isLogIn() {
    return this.loginService.isLoggedIn();
  }

  goToPage(route){
    this.router.navigateByUrl(route);
  }

}
