import { Component, OnInit, Input } from '@angular/core';
import { FileItem } from '../models/fileitem';
import { Router, NavigationExtras } from '@angular/router';
// import { FileType } from '../models/enum.file-type';
enum FileType{
  Summary = 1,
  QA = 2,
  SpeechToText = 3
}

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.scss']
})
export class MyFilesComponent implements OnInit {
  files = new Array<FileItem>();
  _FileType = FileType;
  constructor(private router : Router) {}

  ngOnInit() {
    for (let i = 0; i < 4; i++) {
      const fileObj = new FileItem();
      fileObj.FileId = i;
      fileObj.FileName = 'Summary .pdf';
      fileObj.CreatedOn = '18-05-2017 17:24';
      fileObj.ModifiedDate = '18-05-2017 17:24';
      fileObj.collapse = true;
      fileObj.FileSize = '1,113 KB';
      fileObj.FileType = this._FileType.Summary;
      fileObj.GeneratedSummaryText =
        'Eznotes provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use. We provide the highest quality service with our flexible and cost efficient plans that will improve your workflow and increase your profitability.';

      this.files.push(fileObj);
    }

    for (let i = 0; i < 4; i++) {
      const fileObj = new FileItem();
      fileObj.FileId = i;
      fileObj.FileName = 'QA-Summary.pdf';
      fileObj.CreatedOn = '18-05-2017 17:24';
      fileObj.ModifiedDate = '18-05-2017 17:24';
      fileObj.collapse = true;
      fileObj.FileSize = '897 KB';
      fileObj.FileType = this._FileType.QA;
      fileObj.GeneratedSummaryText =
        'Eznotes provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use. We provide the highest quality service with our flexible and cost efficient plans that will improve your workflow and increase your profitability.';
      this.files.push(fileObj);
    }

    for (let i = 0; i < 4; i++) {
      const fileObj = new FileItem();
      fileObj.FileId = i;
      fileObj.FileName = 'SpeechToText.pdf';
      fileObj.CreatedOn = '18-05-2017 17:24';
      fileObj.ModifiedDate = '18-05-2017 17:24';
      fileObj.collapse = true;
      fileObj.FileSize = '4,002 KB';
      fileObj.FileType =  this._FileType.SpeechToText
      fileObj.GeneratedSummaryText =
        'Eznotes provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use. We provide the highest quality service with our flexible and cost efficient plans that will improve your workflow and increase your profitability.';

      this.files.push(fileObj);
    }
  }

  // toggleCard(file: FileItem){
  //   file.showEdit = !file.showEdit;
  // }

  editFile(file : FileItem){
    const queryParams : NavigationExtras = {
      queryParams : {
        id: 1
      }
    }
    if(file.FileType===FileType.QA){
      this.router.navigate(['qa-summary'],queryParams);
    }
    if(file.FileType===FileType.Summary){
      this.router.navigate(['summary'],queryParams);
    }
    if(file.FileType===FileType.SpeechToText){
      this.router.navigate(['editor'],queryParams);
    }
  }
}
