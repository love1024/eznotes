import { Component, OnInit, Input } from '@angular/core';
import { SRCSET_ATTRS } from '@angular/core/src/sanitization/html_sanitizer';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent implements OnInit {

  @Input() src;

  constructor() { }

  ngOnInit() {
  }

}
