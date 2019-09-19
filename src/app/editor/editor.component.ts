import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('videoPlayer') videoplayer: ElementRef;

  tab = 'textSummary';

  videoUrl = '';

  file:IFile;

  filetexts = [];

  currentTime = 0;

  highlight = 'highlight';

  completeTranscript = '';

  isPaused = false;
  
  isMute = false;

  isSpeedFast = false;


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

  highlightText(event){
    this.currentTime = event.currentTarget.currentTime;
    console.log(this.currentTime);
  }

  toggleVideo(event: any) {
    let nativeElement = this.videoplayer.nativeElement;
    if(nativeElement.paused)
    {
      this.isPaused = false;
      nativeElement.play();
    }
    else{
      this.isPaused = true;
      nativeElement.pause();
    }   
  }

  toggleSpeed(event: any) {
    let nativeElement = this.videoplayer.nativeElement;
    if(nativeElement.playbackRate == 1.0)
    {
      this.isSpeedFast = true;
      nativeElement.playbackRate = 2.0
    }
    else{
      this.isSpeedFast = false;
      nativeElement.playbackRate = 1.0
    }   
  }

  toggleAudio(event: any) {
    let nativeElement = this.videoplayer.nativeElement;
    if(nativeElement.muted)
    {
      this.isMute = false;
      nativeElement.muted = false;
    }
    else{
      this.isMute = true;
      nativeElement.muted = true;
    }   
  }

  rewind5Sec(event:any){
    let nativeElement = this.videoplayer.nativeElement;
    nativeElement.currentTime -= 5;
  }

  getCompleteFileTranscript(){
    this.filetexts.forEach(filetext => {
      this.completeTranscript = this.completeTranscript +  filetext.Alternatives[0].Transcript + ' ';
    });
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
