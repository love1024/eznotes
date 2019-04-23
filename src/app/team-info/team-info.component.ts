import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.scss']
})
export class TeamInfoComponent implements OnInit {

  @Input() Content;
  @Input() Brief;
  @Input() Title;

  constructor() {}

  ngOnInit() {
    this.Content = this.Content ? this.Content : 'Content';
    this.Brief = this.Brief ? this.Brief : 'Brief';
    this.Title = this.Title ? this.Title : 'Title';
  }

}
