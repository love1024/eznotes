import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'liivlabs';
  showFooter = true;

  constructor(public route: ActivatedRoute){}

  ngOnInit(){
  }

  setRouter(name) {
    if (name === 'pricing' || name === 'blog' || name === 'contact') {
      this.showFooter = false;
    } else {
      this.showFooter = true;
    }
  }
}
