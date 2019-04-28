import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  Content=[];

  constructor() { }

  ngOnInit() {
  }

  setAllContents(){
    this.Content.push('Pay as you Go');
    this.Content.push('Basic');
    this.Content.push('Professional');

  }

}
