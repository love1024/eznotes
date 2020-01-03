import { Component, OnInit, Input } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { FileService } from "../service/file/file.service";
import { IFile } from "../models/fileitem";
import { NotifierService } from "angular-notifier";
import { of, Subject } from "rxjs";
import * as jsPDF from "jspdf";
import { LoginService } from "../service/login/login.service";
import * as html2pdf from "html2pdf.js";
import { NgxSpinnerService } from "ngx-spinner";

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

  files: IFile[] = [];

  selectedFile: IFile;

  subject$ = new Subject<string>();

  constructor(
    private spinner: NgxSpinnerService,
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
          id: file.videoFileName,
          edit: true
        }
      };
      if (file.hasSummary) {
        this.router.navigate(["summary"], queryParams);
      } else if (file.hasQa) {
        this.router.navigate(["qa-summary"], queryParams);
      } else {
        this.router.navigate(["editor"], queryParams);
      }
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

  onDownloadShown(file: IFile): void {
    this.selectedFile = file;
  }

  onDownload(isPdf, withSepaker): void {
    this.withSpeaker = withSepaker;
    if (isPdf) {
      this.giveDownloadFile(this.selectedFile);
    } else {
      this.giveDownloadDoc(this.selectedFile);
    }
  }

  onCaptionDownload(): void {
    const subtitle = this.convertGSTTToSRT(this.selectedFile.text);
    const myblob = new Blob([subtitle], {
      type: "text/plain"
    });
    const formData = new FormData();
    formData.append("file", myblob, this.selectedFile.videoFileName);
    this.notifier.notify("success", "File download in progress");
    this.fileService.downloadCaptionFile(
      formData,
      this.selectedFile.videoFileName
    );
  }

  onSummaryDownload() {
    this.downloadTextPdf(
      this.selectedFile.hasSummary
        ? this.selectedFile.summary
        : this.selectedFile.qa,
      this.selectedFile.originalName,
      this.selectedFile
    );
  }

  giveDownloadFile(file: IFile) {
    this.fileService.getFile(file.videoFileName).subscribe(res => {
      if (file.audioFileName) {
        const text = JSON.parse(res.text);
        this.getCompleteFileTranscripts(
          text,
          file.originalName,
          this.withSpeaker
        );
      } else {
        this.downloadTextPdf(file.text, file.originalName, file);
      }
    });
  }

  giveDownloadDoc(file: IFile) {
    this.fileService.getFile(file.videoFileName).subscribe(res => {
      if (file.audioFileName) {
        const text = JSON.parse(res.text);
        this.getCompleteTranscriptDoc(
          text,
          file.originalName,
          this.withSpeaker
        );
      } else {
        this.getCompleteTranscriptText(res.text, file.originalName, file);
      }
    });
  }

  downloadTextPdf(text: string, name: string, file: IFile) {
    this.fileService.updateFile(file).subscribe(() => {
      var doc = new jsPDF();
      let height = 20;
      let pageHeight = doc.internal.pageSize.height;
      let currentPage = pageHeight;
      const lines = doc.splitTextToSize(text, 180);
      lines.forEach(line => {
        doc.text(15, height, line);
        if (height + 7 > currentPage) {
          doc.addPage();
          height = 20;
          currentPage += pageHeight;
        }
        height += 7;
      });
      doc.save(name + ".pdf");
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

  getCompleteTranscriptText(text: any, name: string, file: IFile) {
    this.fileService.updateFile(file).subscribe(() => {
      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
      var footer = "</body></html>";
      let html = "<p>" + text + "</p>";
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
    });
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

  convertGSTTToSRT(string) {
    var obj = JSON.parse(string);
    var i = 1;
    var result = "";
    for (const line of obj) {
      result += i++;
      result += "\n";
      var word = line.Alternatives[0].Words[0];
      var ttime = word.StartTime.Seconds + word.StartTime.Nanos / 1000000000;
      var time = this.convertSecondStringToRealtime(ttime + "");
      result += this.formatTime(time) + " --> ";

      word = line.Alternatives[0].Words[line.Alternatives[0].Words.length - 1];
      ttime = word.EndTime.Seconds + word.EndTime.Nanos / 1000000000;
      time = this.convertSecondStringToRealtime(ttime + "");
      result += this.formatTime(time) + "\n";
      result += line.Alternatives[0].Transcript + "\n\n";
    }
    return result;
  }

  formatTime(time) {
    return (
      String(time.hours).padStart(2, "0") +
      ":" +
      String(time.minutes).padStart(2, "0") +
      ":" +
      String(time.seconds).padStart(2, "0") +
      ",000"
    );
  }

  convertSecondStringToRealtime(string) {
    var seconds = string.substring(0, string.length - 1);
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor((seconds % 3600) % 60);
    return {
      hours,
      minutes,
      seconds
    };
  }
}
