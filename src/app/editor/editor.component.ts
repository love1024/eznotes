import { Component, OnInit, ViewChild } from '@angular/core';
import { AudioItem } from '../models/audioitem';
// import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { FileItem } from '../models/fileitem';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  // @ViewChild('tabset') tabset: TabsetComponent;
  files = new Array<AudioItem>();
  summaryfiles = new Array<FileItem>();
  // editorTab = false;
  tab = 'textSummary';
  constructor(private router: Router) {}

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      const audioObj = new AudioItem();
      audioObj.AudioId = i;
      audioObj.UserName = 'Speaker 1';
      audioObj.AudioText =
        'Eznotes provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use.';
      audioObj.AudioLength = '00:21';
      this.files.push(audioObj);
    }
  }

  setTab(tabName) {
    this.tab = tabName;
  }

  // toggleCard(file: FileItem) {
  //   const extras: NavigationExtras = {
  //     queryParams: {
  //       id: 1
  //     }
  //   };
  //   this.router.navigate(['/summary'], extras);
  //   // file.showEdit = !file.showEdit;
  // }

  goToRoute(route){
    switch(route){
      case 'Summary':{
        this.router.navigateByUrl('summary?id='+ 1);
        break;
      }
      case 'QA':{
        this.router.navigateByUrl('qa-summary?id='+ 1);
      }
    }
  }
}
