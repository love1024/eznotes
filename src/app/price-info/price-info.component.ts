import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-price-info',
  templateUrl: './price-info.component.html',
  styleUrls: ['./price-info.component.scss']
})
export class PriceInfoComponent implements OnInit {
  @Input() Content;
  @Input() Price;
  @Input() Title;
  @Input() Time;

  constructor() {}

  ngOnInit() {
    this.Content = this.Content;
    this.Price = this.Price;
    this.Title = this.Title ;
    this.Time = this.Time ;
  }
}
