import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  src = 'http://159.89.118.118/wp-content/uploads/2019/03/african-american-3810584_1280-1080x675.jpg';

  constructor() { }

  ngOnInit() {
  }

}
