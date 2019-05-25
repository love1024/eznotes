import { Component, OnInit, ViewChild } from '@angular/core';
import { AudioItem } from '../models/audioitem';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  files=new Array<AudioItem>();
  editorTab = false;
  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      const audioObj = new AudioItem();
      audioObj.AudioId = i;
      audioObj.UserName = 'Speaker 1';
      audioObj.AudioText =
        'LiivLabs provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use.';
      audioObj.AudioLength = '00:21';
      this.files.push(audioObj);
    }
  }
}
