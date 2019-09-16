import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../service/summary/summary.service';
import { NgxSpinnerService } from 'ngx-spinner';
import pdfjsLib from 'pdfjs-dist';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  text = '';
  generatedSummary = '';

  constructor(
    private summaryService: SummaryService,
    private spinner: NgxSpinnerService,
    private router : Router,
    public route : ActivatedRoute
  ) {}

  ngOnInit() {
    $(window).resize(() => {
      if ($(window).width() < 1270) {
        $('.price-items').removeClass('col-3');
        $('.price-items').addClass('col-md-6 offset-md-2');
        $('.faq-container').removeClass('row');
        $('.faq-items').removeClass('col-5');
        $('.faq-items').addClass('col-md-6 offset-md-1');
      }

      if ($(window).width() > 1270) {
        $('.price-items').addClass('col-3');
        $('.price-items').removeClass('col-md-6 offset-md-2');
        $('.faq-items').addClass('col-5');
        $('.faq-container').addClass('row');
        $('.faq-items').removeClass('col-md-6 offset-md-1');
      }
    });
   const id = this.route.snapshot.queryParams['id'];
   if(id > 0){
    this.text = 'Eznotes provides the highest quality audio-to-text and video-to-text transcription services available on the market through proprietary technology that is fast, secure, accurate and easy to use. We provide the highest quality service with our flexible and cost efficient plans that will improve your workflow and increase your profitability.';
    this.generatedSummary = 'Eznotes provides the highest quality audio-to-text transcription services which is fast, secure, accurate and easy to use.';
   }
  }

  navigateMyFiles(){
    this.router.navigateByUrl('/myfiles');
  }

  handleUpload(event): void {
    this.text = '';
    const file: File = event.target.files[0];
    if(file.type.includes('pdf')) {
      this.readPDFContent(event);
    } else {
      this.readFileContent(file)
      .then((content: any) => {
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
      Evidence: this.text
    };
    this.spinner.show();
    this.summaryService.summaryText(payload).subscribe(res => {
      this.generatedSummary = res.result;
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
