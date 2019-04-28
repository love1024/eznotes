import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  images=[];

  constructor() { }

  ngOnInit() {
    this.images.push('http://159.89.118.118/wp-content/uploads/2019/03/african-american-3810584_1280-1080x675.jpg');
    this.images.push('http://159.89.118.118/wp-content/uploads/2019/03/ots-1080x675-1080x550-400x250.jpg');
    this.images.push('http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-56-400x250.jpg');
    this.images.push('http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-55-400x250.jpg');
    this.images.push('http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-54-400x250.jpg');
    this.images.push('http://159.89.118.118/wp-content/uploads/2018/04/beyond-image-59-400x250.jpg');

  }

}
