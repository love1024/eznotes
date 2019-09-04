import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  Content = [];

  constructor() { }

  ngOnInit() {
    if ($(window).width() < 1270) {
      $('.price-items').removeClass('col-3');
      $('.price-items').addClass('col-md-6 offset-md-2');
      $('.faq-container').removeClass('row');
      $('.faq-items-left').removeClass('col-md-9 offset-md-3');
      $('.faq-items-left').addClass('col-md-6 offset-md-2');
      $('.faq-items-right').removeClass('col-md-10 offset-md-2');
      $('.faq-items-right').addClass('col-md-6 offset-md-2');
    }

    $(window).resize(() => {
      if ($(window).width() < 1270) {
        $('.price-items').removeClass('col-3');
        $('.price-items').addClass('col-md-6 offset-md-2');
        $('.faq-container').removeClass('row');
        $('.faq-items-left').removeClass('col-md-9 offset-md-3');
        $('.faq-items-left').addClass('col-md-6 offset-md-2');
        $('.faq-items-right').removeClass('col-md-10 offset-md-2');
        $('.faq-items-right').addClass('col-md-6 offset-md-2');
      }

      if ($(window).width() > 1270) {
        $('.price-items').addClass('col-3');
        $('.price-items').removeClass('col-md-6 offset-md-2');
        $('.faq-container').addClass('row');
        $('.faq-items-right').addClass('col-md-10 offset-md-2');
        $('.faq-items-right').removeClass('col-md-6 offset-md-2');
        $('.faq-items-left').addClass('col-md-9 offset-md-3');
        $('.faq-items-left').removeClass('col-md-6 offset-md-2');
      }
    });
  }
}
