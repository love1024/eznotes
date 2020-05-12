import { Component, OnInit, Input } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { FileService } from "../service/file/file.service";
import { IFile } from "../models/fileitem";
import { NotifierService } from "angular-notifier";
import { of, Subject, Observable } from "rxjs";
import * as jsPDF from "jspdf";
import { LoginService } from "../service/login/login.service";
import * as html2pdf from "html2pdf.js";
import { NgxSpinnerService } from "ngx-spinner";
import { IQa } from "../models/qa";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { UserService } from "../service/user/user.service";
import { IUser } from "../models/user";

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

  sortByOwnerAsc = false;

  openFollowProfessor = false;

  selected = 0;

  withSpeaker = false;

  files: IFile[] = [];

  selectedFile: IFile;

  subject$ = new Subject<string>();

  dropdownListProfessors = [];

  selectedProfessors = [];

  dropdownSettingsProfessor: IDropdownSettings = {};

  follow = "";

  user: IUser;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private fileService: FileService,
    private notifier: NotifierService,
    private loginService: LoginService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.loginService.getUser();
    this.getFiles();
    this.getAllProfessors();

    this.userService.getUserInfo(this.user.userId).subscribe(user => {
      this.follow = user.follow;
    });
    this.dropdownSettingsProfessor = {
      singleSelection: false,
      idField: "id",
      textField: "value",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  getFiles(): void {
    this.spinner.show();
    this.fileService.getFiles().subscribe(files => {
      this.files = files;
      this.sortByCreated();
      this.spinner.hide();

      this.getNames();
    });
  }

  editFile(file: IFile) {
    file.editedAt = new Date().toJSON();
    const user = this.loginService.getUser();
    this.follow = user.follow;

    this.fileService.updateFile(file, user.emailAddress).subscribe(() => {
      const queryParams: NavigationExtras = {
        queryParams: {
          id: file.videoFileName,
          edit: true,
          email: user.emailAddress
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

  getNames(): void {
    this.files.forEach(async file => {
      const user = await this.getUserInfoByEmail(file.userEmail);
      file.firstName = user.firstName;
      file.lastName = user.lastName;
    });
  }

  async getUserInfoByEmail(email: string): Promise<any> {
    return await this.userService.getUserInfoByEmail(email);
  }

  onFollowSubmit(): void {
    let follow = "";
    this.selectedProfessors.forEach(inst => {
      follow += `${inst.id}, `;
    });

    this.spinner.show();
    this.userService.followProfessors({ follow: follow }).subscribe(res => {
      this.spinner.hide();
      this.follow = follow;
      this.getFiles();
    });
  }

  getAllProfessors(): void {
    this.spinner.show();
    this.userService
      .getAllProfessors(this.user.parentUserId)
      .subscribe(professors => {
        this.dropdownListProfessors = professors.map(inst => {
          return {
            id: inst.userId,
            value: `${inst.firstName} ${inst.lastName}`
          };
        });
        this.spinner.hide();
        this.getSelectedProfessor(professors);
      });
  }

  getSelectedProfessor(professors: IUser[]): void {
    if (!this.follow) {
      return;
    }
    const professorId = this.follow.split(",");
    this.selectedProfessors = [];
    professorId.forEach(p => {
      if (p) {
        const found = professors.filter(prof => prof.userId == +p);
        if (found.length > 0) {
          this.selectedProfessors.push({
            id: found[0].userId,
            value: `${found[0].firstName} ${found[0].lastName}`
          });
        }
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
    const data = {
      text: newName,
      filename: file.videoFileName,
      email: this.user.emailAddress
    };
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

  sortByOwner() {
    this.sortByOwnerAsc = !this.sortByOwnerAsc;
    this.selected = 2;
    this.files.sort((a, b) => {
      if (this.sortByOwnerAsc) {
        return a.userEmail.localeCompare(b.userEmail);
      } else {
        return b.userEmail.localeCompare(a.userEmail);
      }
    });
  }

  sortByCreated() {
    this.selected = 3;
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
    this.selected = 4;
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

  onSummaryDownload(isDoc = false) {
    const user = this.loginService.getUser();
    if (this.selectedFile.hasSummary) {
      this.fileService
        .getFile(this.selectedFile.videoFileName, user.emailAddress)
        .subscribe(res => {
          if (isDoc) {
            this.getCompleteTranscriptText(res.summary, res.originalName, res);
          } else {
            this.downloadTextPdf(res.summary, res.originalName, res);
          }
        });
    } else {
      this.fileService
        .getFile(this.selectedFile.videoFileName, user.emailAddress)
        .subscribe(res => {
          if (isDoc) {
            this.getCompleteTranscriptTextQA(
              JSON.parse(res.qa).cards,
              res.originalName,
              res
            );
          } else {
            this.downloadQAPdf(JSON.parse(res.qa).cards, res.originalName, res);
          }
        });
    }
  }

  giveDownloadFile(file: IFile) {
    const user = this.loginService.getUser();
    this.fileService
      .getFile(file.videoFileName, user.emailAddress)
      .subscribe(res => {
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
    const user = this.loginService.getUser();
    this.fileService
      .getFile(file.videoFileName, user.emailAddress)
      .subscribe(res => {
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
    const user = this.loginService.getUser();
    this.fileService.updateFile(file, user.emailAddress).subscribe(() => {
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

  downloadQAPdf(text: IQa[], name: string, file: IFile) {
    const user = this.loginService.getUser();
    this.fileService.updateFile(file, user.emailAddress).subscribe(() => {
      var doc = new jsPDF();
      let height = 20;
      let pageHeight = doc.internal.pageSize.height;
      let currentPage = pageHeight;
      let idx = 1;
      text.forEach(qa => {
        let lines = doc.splitTextToSize(qa.question, 180);
        doc.setFontType("bold");
        doc.text(15, height, "Question: " + idx);
        doc.setFontType("normal");
        height += 7;
        idx++;
        lines.forEach(line => {
          doc.text(15, height, line);
          if (height + 7 > currentPage) {
            doc.addPage();
            height = 20;
            currentPage += pageHeight;
          }
          height += 7;
        });

        doc.setFontType("bold");
        doc.text(15, height, "Answer");
        doc.setFontType("normal");
        height += 7;
        lines = doc.splitTextToSize(qa.answer, 180);
        doc.setFontType("normal");
        lines.forEach(line => {
          doc.text(15, height, line);
          if (height + 7 > currentPage) {
            doc.addPage();
            height = 20;
            currentPage += pageHeight;
          }
          height += 7;
        });

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
    const user = this.loginService.getUser();
    this.fileService.updateFile(file, user.emailAddress).subscribe(() => {
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

  getCompleteTranscriptTextQA(text: IQa[], name: string, file: IFile) {
    const user = this.loginService.getUser();
    this.fileService.updateFile(file, user.emailAddress).subscribe(() => {
      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
      var footer = "</body></html>";
      let html = "";
      text.forEach(qa => {
        html += "<strong>Question</strong>";
        html += "<p>" + qa.question + "</p>";
        html += "<strong>Answer</strong>";
        html += "<p>" + qa.answer + "</p>";
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
    });
  }

  getCompleteTranscriptDoc(text: any, name: string, withSpeaker: boolean) {
    console.log(text);
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
    var index = 1;
    var result = "";
    var prev = -1;
    for (const line of obj) {
      let j,
        chunk = 15;
      const arr = line.Alternatives[0].Words;
      for (let i = 0, j = arr.length; i < j; i += chunk) {
        let temparray = arr.slice(i, i + chunk);

        var word = temparray[0];
        var ttime = word.StartTime.Seconds + word.StartTime.Nanos / 1000000000;
        if (ttime < prev) {
          continue;
        }
        var time = this.convertSecondStringToRealtime(ttime);
        result += index++;
        result += "\n";
        result += this.formatTime(time) + " --> ";

        word = temparray[temparray.length - 1];
        ttime = word.EndTime.Seconds + word.EndTime.Nanos / 1000000000;
        time = this.convertSecondStringToRealtime(ttime);
        result += this.formatTime(time) + "\n";
        prev = ttime;
        result +=
          temparray.reduce((text, cur) => text + " " + cur.Word, "") + "\n\n";
      }
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

  convertSecondStringToRealtime(time) {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = Math.floor(time % 60);
    return {
      hours,
      minutes,
      seconds
    };
  }
}
