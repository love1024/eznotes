import { Component, OnInit, ViewChild } from '@angular/core';
import { AudioItem } from '../models/audioitem';
// import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { IFile } from '../models/fileitem';
import { FileService } from '../service/file/file.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  
  tab = 'textSummary';

  videoUrl = '';

  file:IFile;

  filetexts = [];

  constructor(private route: ActivatedRoute, private fileService: FileService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const fileName = params['id'];
      this.fileService.getFileUrl(fileName).subscribe((res) => {
        this.videoUrl = res.url;
      });
      this.fileService.getFile(fileName).subscribe((res) => {
        this.file = res;
        this.filetexts = JSON.parse(res.text);
      });

    });
  }

  setTab(tabName) {
    this.tab = tabName;
  }


  // goToRoute(route){
  //   switch(route){
  //     case 'Summary':{
  //       this.router.navigateByUrl('summary?id='+ 1);
  //       break;
  //     }
  //     case 'QA':{
  //       this.router.navigateByUrl('qa-summary?id='+ 1);
  //     }
  //   }
  // }
}
