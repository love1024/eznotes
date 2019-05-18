import { Component, OnInit } from '@angular/core';
import { FileItem } from '../models/fileitem';

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.scss']
})
export class MyFilesComponent implements OnInit {
  files=new Array<FileItem>();

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 6; i++) {
      const fileObj = new FileItem();
      fileObj.FileId = i;
      fileObj.FileName = 'FirstDocument.pdf';
      fileObj.CreatedOn = '18-05-2017 17:24:00';
      fileObj.collapse = true;
      fileObj.FileSize = '1,113 KB';
      fileObj.GeneratedSummaryText =
        'LiivLabs provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use. We provide the highest quality service with our flexible and cost efficient plans that will improve your workflow and increase your profitability.';
      fileObj.showEdit = false;
      this.files.push(fileObj);
    }
  }

  toggleCard(file: FileItem){
    file.showEdit = !file.showEdit;
  }
}
