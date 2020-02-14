import { Component, OnInit } from "@angular/core";
import { SummaryService } from "../service/summary/summary.service";
import { NgxSpinnerService } from "ngx-spinner";
import pdfjsLib from "pdfjs-dist";
import { Router, ActivatedRoute } from "@angular/router";
import { IQa, IQaCards } from "../models/qa";
import { NotifierService } from "angular-notifier";
import { FileService } from "../service/file/file.service";
import { IFile } from "../models/fileitem";

@Component({
  selector: "app-qa-summary",
  templateUrl: "./qa-summary.component.html",
  styleUrls: ["./qa-summary.component.scss"]
})
export class QaSummaryComponent implements OnInit {
  text: string = "";
  query: string = "";
  generatedSummary = "";
  popupQ = "";
  popupA = "";
  isPopupOpen = false;
  isQuestion = true;
  current: IQa[] = [];
  savedCards: IQaCards;
  currentIdx = 0;
  isEdit = false;
  file: IFile;
  showWarning = false;
  currentUserEmail = "";

  constructor(
    private summaryService: SummaryService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private notifier: NotifierService,
    public route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const fileName = params["id"];
      const isEdit = params["edit"];
      this.currentUserEmail = params["email"];
      this.isEdit = isEdit;

      this.fileService
        .getFile(fileName, this.currentUserEmail)
        .subscribe((res: IFile) => {
          this.file = res;
          if (isEdit) {
            this.text = res.qaInput;
            const questionAns = JSON.parse(res.qa);
            this.current = questionAns.cards;
            this.play();
          } else {
            this.text = this.getCompleteFileTranscript(res.text);
          }
        });
    });
  }

  navigateMyFiles() {
    this.router.navigateByUrl("/myfiles");
  }

  generateSummary(popupName?: string, query?: string): void {
    const queryText = query || this.query;

    if (queryText == undefined || queryText == null || queryText == "") {
      this.showWarning = true;
      return;
    }
    const payload = {
      Evidence: this.text,
      Question: queryText
    };
    this.spinner.show(popupName);
    this.summaryService.queryText(payload).subscribe(res => {
      this.generatedSummary = res.result || "";
      this.popupQ = queryText;
      this.popupA = this.generatedSummary;
      this.current[this.currentIdx] = {
        question: this.popupQ,
        answer: this.popupA
      };
      if (!this.isPopupOpen) {
        this.isPopupOpen = true;
      }
      this.spinner.hide(popupName);
    });
  }

  getCompleteFileTranscript(text: any) {
    text = JSON.parse(text);
    let result = "";
    text.forEach(filetext => {
      filetext.Alternatives[0].Words.map((word, innerIndex) => {
        result = result + word.Word + " ";
      });
    });
    return result;
  }

  closePopup() {
    this.isPopupOpen = false;
    this.currentIdx = 0;
  }

  toggleCard() {
    if (this.popupQ == undefined || this.popupQ == null || this.popupQ == "") {
      return;
    }
    this.isQuestion = !this.isQuestion;
    if (!this.isQuestion && this.popupA == "") {
      this.generateSummary("popup", this.popupQ);
    } else {
    }
    document.getElementById("focus-area").focus();
  }

  addQuestion() {
    this.isQuestion = true;
    this.current.push({
      question: "",
      answer: ""
    });
    this.popupQ = "";
    this.popupA = "";
    this.currentIdx = this.current.length - 1;
    this.notifier.notify("success", "Card added successfully");
    document.getElementById("focus-area").focus();
  }

  saveCard() {
    this.file.qa = JSON.stringify({ cards: this.current });
    this.file.qaInput = this.text;
    this.file.hasQa = true;
    this.file.isNew = true;
    this.file.originalSize = undefined;
    this.file.text = "";
    this.spinner.show();
    if (this.isEdit) {
      this.fileService
        .updateFileUse(this.file, this.currentUserEmail)
        .subscribe(res => {
          this.spinner.hide();
          this.notifier.notify("success", "Card saved successfully");
        });
    } else {
      this.file.fileId = undefined;
      this.fileService.uploadFileWithText(this.file).subscribe(res => {
        this.spinner.hide();
        this.notifier.notify("success", "Card saved successfully");
      });
    }
  }

  forward(event) {
    event.stopPropagation();
    this.isQuestion = true;
    this.current[this.currentIdx].question = this.popupQ;
    this.current[this.currentIdx].answer = this.popupA;
    this.currentIdx++;
    this.popupQ = this.current[this.currentIdx].question;
    this.popupA = this.current[this.currentIdx].answer;
  }

  backward() {
    event.stopPropagation();
    this.isQuestion = true;
    this.current[this.currentIdx].question = this.popupQ;
    this.current[this.currentIdx].answer = this.popupA;
    this.currentIdx--;
    this.popupQ = this.current[this.currentIdx].question;
    this.popupA = this.current[this.currentIdx].answer;
  }

  play() {
    this.isPopupOpen = true;
    this.isQuestion = true;
    this.currentIdx = 0;
    if (this.current.length > 0) {
      this.popupQ = this.current[0].question;
      this.popupA = this.current[0].answer;
    }
  }
}
