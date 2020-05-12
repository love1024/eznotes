import { Component, OnInit } from "@angular/core";
import { SummaryService } from "../service/summary/summary.service";
import { NgxSpinnerService } from "ngx-spinner";
import pdfjsLib from "pdfjs-dist";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { FileService } from "../service/file/file.service";
import { IFile } from "../models/fileitem";
import { NotifierService } from "angular-notifier";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.scss"]
})
export class SummaryComponent implements OnInit {
  file: IFile;

  text = "";

  isEdit = false;

  generatedSummary = "";

  currentUserEmail = "";

  constructor(
    private summaryService: SummaryService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fileService: FileService,
    public route: ActivatedRoute,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    $(window).resize(() => {
      if ($(window).width() < 1270) {
        $(".price-items").removeClass("col-3");
        $(".price-items").addClass("col-md-6 offset-md-2");
        $(".faq-container").removeClass("row");
        $(".faq-items").removeClass("col-5");
        $(".faq-items").addClass("col-md-6 offset-md-1");
      }

      if ($(window).width() > 1270) {
        $(".price-items").addClass("col-3");
        $(".price-items").removeClass("col-md-6 offset-md-2");
        $(".faq-items").addClass("col-5");
        $(".faq-container").addClass("row");
        $(".faq-items").removeClass("col-md-6 offset-md-1");
      }
    });
    this.route.queryParams.subscribe(params => {
      const fileName = params["id"];
      const isEdit = params["edit"];
      this.currentUserEmail = params["email"];
      this.isEdit = isEdit;

      this.fileService
        .getFile(fileName, this.currentUserEmail)
        .subscribe(res => {
          this.file = res;
          this.generatedSummary = res.summary;
          if (isEdit) {
            this.text = res.summaryInput;
          } else {
            this.text = this.getCompleteFileTranscript(res.text);
          }
        });
    });
  }

  saveSummary() {
    this.file.summary = this.generatedSummary;
    this.file.summaryInput = this.text;
    this.file.hasSummary = true;
    this.file.isNew = true;
    this.file.originalSize = undefined;
    this.file.text = "";
    this.spinner.show();
    if (this.isEdit) {
      this.fileService
        .updateFileUse(this.file, this.currentUserEmail)
        .subscribe(res => {
          this.spinner.hide();
          this.notifier.notify("success", "Summary saved successfully");
        });
    } else {
      this.file.fileId = undefined;
      this.fileService.uploadFileWithText(this.file).subscribe(res => {
        this.spinner.hide();
        this.notifier.notify("success", "Summary saved successfully");
      });
    }
  }

  navigateMyFiles() {
    this.router.navigateByUrl("/myfiles");
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

  handleUpload(event): void {
    this.text = "";
    const file: File = event.target.files[0];
    if (file.type.includes("pdf")) {
      this.readPDFContent(event);
    } else {
      this.readFileContent(file).then((content: any) => {
        this.text = content;
      });
    }
  }

  readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event: any) => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file, "UTF-8");
    });
  }

  generateSummary(): void {
    const payload = {
      Evidence: this.text
    };
    this.spinner.show();
    this.summaryService.summaryText(payload).subscribe(res => {
      this.generatedSummary = res.result;
      this.spinner.hide();
    });
  }

  readPDFContent(event) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "../../assets/pdf.worker.js";
    const filereader = new FileReader();
    const file: File = event.target.files[0];
    filereader.readAsArrayBuffer(file);
    filereader.onload = () => {
      const typedArray = new Uint8Array(<ArrayBuffer>filereader.result);
      pdfjsLib.getDocument(typedArray).then(
        PDFDocumentInstance => {
          const totalPages = PDFDocumentInstance._pdfInfo.numPages;
          for (let i = 1; i <= totalPages; i++) {
            this.getPageText(i, PDFDocumentInstance).then(textPage => {
              this.text = this.text + textPage;
            });
          }
        },
        reason => {
          console.error(reason);
        }
      );
    };
  }

  getPageText(pageNum, PDFDocumentInstance) {
    return new Promise((resolve, reject) => {
      PDFDocumentInstance.getPage(pageNum).then(pdfPage => {
        pdfPage.getTextContent().then(textContent => {
          let textItems = textContent.items;
          let finalString = "";
          for (let i = 0; i < textItems.length; i++) {
            let item = textItems[i];
            finalString += item.str + " ";
          }
          resolve(finalString);
        });
      });
    });
  }
}
