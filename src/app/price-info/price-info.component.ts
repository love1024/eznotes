import { Component, OnInit, Input } from '@angular/core';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-price-info',
  templateUrl: './price-info.component.html',
  styleUrls: ['./price-info.component.scss']
})
export class PriceInfoComponent implements OnInit {
  @Input() Content;
  @Input() Price;
  @Input() Title;

  constructor() {}

  ngOnInit() {
    this.Content = this.Content ? this.Content : 'Content';
    this.Price = this.Price ? this.Price : 'Price';
    this.Title = this.Title ? this.Title : 'Title';
  }
}
