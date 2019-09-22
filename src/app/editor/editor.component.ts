import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFile } from '../models/fileitem';
import { FileService } from '../service/file/file.service';
import { SummaryService } from '../service/summary/summary.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: ElementRef;

  tab = 'textSummary';

  videoUrl = '';

  file: IFile;

  filetexts = [];

  currentTime = 0;

  highlight = 'highlight';

  completeTranscript = '';

  isPaused = false;

  isMute = false;

  isSpeedFast = false;

  spanEdited = '';


  constructor(
    private route: ActivatedRoute, 
    private fileService: FileService,
    private router: Router,
    private summaryService: SummaryService,) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const fileName = params['id'];
      this.fileService.getFileUrl(fileName).subscribe((res) => {
        this.videoUrl = res.url;
      });
      this.fileService.getFile(fileName).subscribe((res) => {
        this.file = res;
        this.filetexts = JSON.parse(res.text);
        this.getCompleteFileTranscript();
      });

    });
  }

  setTab(tabName) {
    this.tab = tabName;
  }

  highlightText(event) {
    this.currentTime = event.currentTarget.currentTime;
  }

  toggleVideo() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.paused) {
      this.isPaused = false;
      nativeElement.play();
    }
    else {
      this.isPaused = true;
      nativeElement.pause();
    }
  }

  toggleSpeed() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.playbackRate == 1.0) {
      this.isSpeedFast = true;
      nativeElement.playbackRate = 2.0
    }
    else {
      this.isSpeedFast = false;
      nativeElement.playbackRate = 1.0
    }
  }

  toggleAudio() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.muted) {
      this.isMute = false;
      nativeElement.muted = false;
    }
    else {
      this.isMute = true;
      nativeElement.muted = true;
    }
  }

  rewind5Sec() {
    let nativeElement = this.videoplayer.nativeElement;
    nativeElement.currentTime -= 5;
  }

  getCompleteFileTranscript() {
    this.filetexts.forEach(filetext => {
      this.completeTranscript = this.completeTranscript + filetext.Alternatives[0].Transcript + ' ';
    });
  }

  onContentChange(event, html) {
    html = html.replace(/&nbsp;|nbsp;|&amp;|amp;/g,'');
    let currentTarget = event.currentTarget
    //fetching the exact word
    let alternativesIndex = currentTarget.dataset.outerindex;
    let wordIndex = currentTarget.dataset.innerindex;
    let filetexts =JSON.parse(JSON.stringify(this.filetexts));
    // updating the current text
    filetexts[alternativesIndex].Alternatives[0].Words[wordIndex].Word = html;
    let data = { Text: JSON.stringify(filetexts) };
    this.fileService.changeFileText(data, this.file.fileId).subscribe(res => {
    });
  }

  updateVideoTime(event) {
    let currentTarget = event.currentTarget
    let timeOfSpan = currentTarget.dataset.time;
    let nativeElement = this.videoplayer.nativeElement;
    nativeElement.currentTime = timeOfSpan;
  }


  goToRoute(route){
    this.summaryService.textEmitter.next(this.completeTranscript);
    switch(route){
      case 'Summary':{
        this.router.navigateByUrl('summary');
        break;
      }
      case 'QA':{
        this.router.navigateByUrl('qa-summary');
      }
    }
  }
}
