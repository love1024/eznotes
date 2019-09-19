import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FileService } from '../service/file/file.service';
import { IFile } from '../models/fileitem';
// import { FileType } from '../models/enum.file-type';
enum FileType {
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

  files: IFile[] = [];

  constructor(private router: Router, private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getFiles().subscribe((files) => {
      this.files = files;
      console.log(this.files);
    })
  }

  // toggleCard(file: FileItem){
  //   file.showEdit = !file.showEdit;
  // }

  editFile(file: IFile) {
    const queryParams: NavigationExtras = {
      queryParams: {
        id: file.videoFileName
      }
    }
    this.router.navigate(['editor'], queryParams);
  }

 
}
