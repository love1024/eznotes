import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../service/summary/summary.service';
import { NgxSpinnerService } from 'ngx-spinner';
import pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-qa-summary',
  templateUrl: './qa-summary.component.html',
  styleUrls: ['./qa-summary.component.scss']
})
export class QaSummaryComponent implements OnInit {
  text: string = '';
  query: '';

  constructor(
    private summaryService: SummaryService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  handleUpload(event): void {
    this.text = '';
    const file: File = event.target.files[0];
    if (file.type.includes('pdf')) {
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
      reader.readAsText(file, 'UTF-8');
    });
  }

  generateSummary(): void {
    const payload = {
      Evidence: this.text,
      Question: this.query
    };
    this.spinner.show();
    this.summaryService.queryText(payload).subscribe(res => {
      this.text = res.result;
      this.spinner.hide();
    });
  }

  readPDFContent(event) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../../assets/pdf.worker.js';
    const filereader = new FileReader();
    const file: File = event.target.files[0];
    filereader.readAsArrayBuffer(file);
    filereader.onload = () => {
      const typedArray = new Uint8Array(<ArrayBuffer>filereader.result);
      pdfjsLib.getDocument(typedArray).then(
        PDFDocumentInstance => {
          const totalPages = PDFDocumentInstance._pdfInfo.numPages;
          let str = '';
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
          let finalString = '';
          for (let i = 0; i < textItems.length; i++) {
            let item = textItems[i];
            finalString += item.str + ' ';
          }
          resolve(finalString);
        });
      });
    });
  }
}
