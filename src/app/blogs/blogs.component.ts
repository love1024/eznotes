import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  images = [];

  constructor() {}

  ngOnInit() {
    if ($(window).width() < 950) {
      $('.blog-item-container').removeClass('row');
      $('.blog-item-container').removeClass('justify-content-around');
      $('.blog-items').removeClass('col-3');
      $('.blog-items').addClass('col-md-6');
    }
    
    $(window).resize(() => {
      if ($(window).width() < 950) {
        $('.blog-item-container').removeClass('row');
        $('.blog-item-container').removeClass('justify-content-around');
        $('.blog-items').removeClass('col-3');
        $('.blog-items').addClass('col-md-6');
      }

      if ($(window).width() > 950) {
        $('.blog-item-container').addClass('row');
        $('.blog-item-container').addClass('justify-content-around');
        $('.blog-items').addClass('col-3');
        $('.blog-items').removeClass('col-md-6');
      }
    });

    this.addImages();
  }

  addImages(){
    this.images.push(
      'http://159.89.118.118/wp-content/uploads/2019/03/african-american-3810584_1280-1080x675.jpg'
    );
    this.images.push(
      'http://159.89.118.118/wp-content/uploads/2019/03/ots-1080x675-1080x550-400x250.jpg'
    );
    this.images.push(
      'http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-56-400x250.jpg'
    );
    this.images.push(
      'http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-55-400x250.jpg'
    );
    this.images.push(
      'http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-54-400x250.jpg'
    );
    this.images.push(
      'http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-59-400x250.jpg'
    );
  }
}
