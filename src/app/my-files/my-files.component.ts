import { Component, OnInit, Input } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { FileService } from "../service/file/file.service";
import { IFile } from "../models/fileitem";
import { NotifierService } from "angular-notifier";
import { of, Subject } from "rxjs";
import * as jsPDF from "jspdf";
import { LoginService } from "../service/login/login.service";

enum FileType {
  Summary = 1,
  QA = 2,
  SpeechToText = 3
}

@Component({
  selector: "app-my-files",
  templateUrl: "./my-files.component.html",
  styleUrls: ["./my-files.component.scss"]
})
export class MyFilesComponent implements OnInit {
  sortByNameAsc = false;

  sortBySizeAsc = false;

  sortByCreatedAsc = true;

  sortByEditedAsc = false;

  selected = 0;

  withSpeaker = false;

  isPdf = false;

  onSecondStep = false;

  selectedIndex = -1;

  files: IFile[] = [];

  subject$ = new Subject<string>();

  constructor(
    private router: Router,
    private fileService: FileService,
    private notifier: NotifierService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.fileService.getFiles().subscribe(files => {
      this.files = files;
      this.sortByCreated();
    });
  }

  editFile(file: IFile) {
    file.editedAt = new Date().toJSON();

    this.fileService.updateFile(file).subscribe(() => {
      const queryParams: NavigationExtras = {
        queryParams: {
          id: file.videoFileName
        }
      };
      this.router.navigate(["editor"], queryParams);
    });
  }

  downloadFile(file: IFile) {
    this.fileService.getFileUrl(file.videoFileName).subscribe(res => {
      window.open(res.url, "blank");
    });
  }

  deleteFile(file: IFile) {
    this.fileService.deleteFile(file.fileId).subscribe(() => {
      this.notifier.notify("success", "File delete successfully");

      this.fileService.getFiles().subscribe(files => {
        this.files = files;
      });
    });
  }

  changeName(file: IFile, newName: string) {
    const data = { text: newName };
    this.fileService.changeName(data, file.fileId).subscribe();
  }

  sortByName() {
    this.sortByNameAsc = !this.sortByNameAsc;
    this.selected = 0;
    this.files.sort((a, b) => {
      if (this.sortByNameAsc) {
        return a.originalName.localeCompare(b.originalName);
      } else {
        return b.originalName.localeCompare(a.originalName);
      }
    });
  }

  sortBySize() {
    this.selected = 1;
    this.sortBySizeAsc = !this.sortBySizeAsc;
    this.files.sort((a, b) => {
      if (this.sortBySizeAsc) {
        return a.originalSize < b.originalSize ? -1 : 1;
      } else {
        return a.originalSize < b.originalSize ? 1 : -1;
      }
    });
  }

  sortByCreated() {
    this.selected = 2;
    this.sortByCreatedAsc = !this.sortByCreatedAsc;
    this.files.sort((a, b) => {
      if (this.sortByCreatedAsc) {
        return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
          ? -1
          : 1;
      } else {
        return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
          ? 1
          : -1;
      }
    });
  }

  sortByEdited() {
    this.selected = 3;
    this.sortByEditedAsc = !this.sortByEditedAsc;
    this.files.sort((a, b) => {
      if (this.sortByEditedAsc) {
        return new Date(a.editedAt).getTime() < new Date(b.editedAt).getTime()
          ? -1
          : 1;
      } else {
        return new Date(a.editedAt).getTime() < new Date(b.editedAt).getTime()
          ? 1
          : -1;
      }
    });
  }

  onDownload(index: number, isCancel: boolean, file: IFile): void {
    if (this.onSecondStep) {
      this.onSecondStep = false;
      this.isPdf = isCancel;
      if (this.isPdf) {
        this.giveDownloadFile(file);
      } else {
        this.giveDownloadDoc(file);
      }
    } else {
      this.onSecondStep = true;
      this.withSpeaker = isCancel;
      this.selectedIndex = index;
    }
  }

  giveDownloadFile(file: IFile) {
    this.fileService.getFile(file.videoFileName).subscribe(res => {
      const text = JSON.parse(res.text);
      this.getCompleteFileTranscripts(
        text,
        file.originalName,
        this.withSpeaker
      );
    });
  }

  giveDownloadDoc(file: IFile) {
    this.fileService.getFile(file.videoFileName).subscribe(res => {
      const text = JSON.parse(res.text);
      this.getCompleteTranscriptDoc(text, file.originalName, this.withSpeaker);
    });
  }

  getCompleteFileTranscripts(
    text: any,
    name: string,
    withSpeaker = true
  ): void {
    let temp = "";
    var doc = new jsPDF();
    let height = 20;
    let pageHeight = doc.internal.pageSize.height;
    let currentPage = pageHeight;

    text.forEach((filetext, idx) => {
      if (idx < text.length - 1) {
        if (withSpeaker) {
          doc.setFontType("bold");
          let ttext = [
            filetext.Alternatives[0].SpeakerName
              ? filetext.Alternatives[0].SpeakerName
              : "Speaker"
          ];
          if (height + 7 > currentPage) {
            doc.addPage();
            height = 20;
            currentPage += pageHeight;
          }
          doc.text(15, height, ttext);
          height += 7;
        }

        filetext.Alternatives[0].Words.map((word, innerIndex) => {
          temp = temp + word.Word + " ";
        });
        doc.setFontType("normal");
        const lines = doc.splitTextToSize(temp, 180);
        if (this.withSpeaker) {
          lines.push("");
        }
        if (height + lines.length * 7 > currentPage) {
          doc.addPage();
          height = 20;
          currentPage += pageHeight;
        }
        doc.text(15, height, lines);
        height += lines.length * 7;
        temp = "";
      }
    });
    doc.save(name + ".pdf");
  }

  getCompleteTranscriptDoc(text: any, name: string, withSpeaker: boolean) {
    var header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    var footer = "</body></html>";
    let html = "";

    let temp = "";
    text.forEach((filetext, idx) => {
      if (idx < text.length - 1) {
        if (withSpeaker) {
          temp += `<h2>${
            filetext.Alternatives[0].SpeakerName
              ? filetext.Alternatives[0].SpeakerName
              : "Speaker"
          }</h2>`;
        }
        filetext.Alternatives[0].Words.map((word, innerIndex) => {
          temp = temp + word.Word + " ";
        });
        html = html + "<p>" + temp + "</p>";
        temp = "";
      }
    });

    let sourceHTML = header + html + footer;

    let source =
      "data:application/vnd.ms-word;charset=utf-8," +
      encodeURIComponent(sourceHTML);
    let fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = name + ".doc";
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }
}
