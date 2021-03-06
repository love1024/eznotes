import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './service/login/login.service';
import { SummaryService } from './service/summary/summary.service';
import { FileService } from './service/file/file.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Eznotes';
  showFooter = true;
  collapsed = true;
  isLoggedIn = false;
  polling;
  isNewFile = false;

  constructor(
    public route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.loginService.isLoggedIn();
    this.loginService.getLogInOutEmitter().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.polling = setInterval(()=>{this.checkNewFile()},5000);
    
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
    this.router.navigateByUrl('home');
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  goToPage(route: string) {
    this.router.navigateByUrl(route);
  }

  checkNewFile(){
    this.fileService.checkNewFile(this.loginService.getUser().emailAddress).subscribe(res => {
      this.isNewFile = res;
    });
  }

  updateStatusForUser(){
    let fileAlert = {Email:this.loginService.getUser().emailAddress,AnyNew:false}
    this.fileService.updateStatusForUser(fileAlert).subscribe(res=>{
      this.isNewFile = false;
    });
  }
}
