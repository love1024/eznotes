import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../service/summary/summary.service';
import { NgxSpinnerService } from 'ngx-spinner';
import pdfjsLib from 'pdfjs-dist';
import { Router, ActivatedRoute } from '@angular/router';
import { IQa, IQaCards } from '../models/qa';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-qa-summary',
  templateUrl: './qa-summary.component.html',
  styleUrls: ['./qa-summary.component.scss']
})
export class QaSummaryComponent implements OnInit {
  text: string = '';
  query: string =  '';
  generatedSummary = '';
  popupQ = '';
  popupA = '';
  isPopupOpen = false;
  isQuestion = true;
  saved: IQa[] = [];
  current: IQa[] = [];
  savedCards: IQaCards[] = [];
  currentIdx = 0;

  constructor(
    private summaryService: SummaryService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route : ActivatedRoute,
    private notifier: NotifierService,
  ) {}

  ngOnInit() {
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

  generateSummary(popupName ?: string,query?: string): void {
    const payload = {
      Evidence: this.text,
      Question: query != undefined ? query : this.query
    };
    this.spinner.show(popupName);
    this.summaryService.queryText(payload).subscribe(res => {
      this.generatedSummary = res.result || "";
      this.popupQ = query != undefined ? query : this.query;
      this.popupA = this.generatedSummary;
      this.current[this.currentIdx] = {
        question: this.popupQ,
        answer: this.popupA
      }
      if(!this.isPopupOpen) {
        this.isPopupOpen = true;
      }
      this.spinner.hide(popupName);
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

  closePopup() {
    this.isPopupOpen = false;
    this.currentIdx = 0;
    const exist = this.savedCards.filter((card) => card.id == 1);
    if(this.saved.length > 0 && exist.length == 0) {
      this.savedCards.push({
        id: 1,
        text: this.text.substr(0, 10) + '...',
        cards: this.saved
      });
    }
  }

  toggleCard() {
    this.isQuestion = !this.isQuestion;
    if(!this.isQuestion && this.popupA == "") {
      this.generateSummary('popup', this.popupQ);
    } else {
    }
    document.getElementById("focus-area").focus();
  }

  addQuestion() {
    this.isQuestion = true;
    this.current.push({
      question: '',
      answer: ''
    })
    this.popupQ = '';
    this.popupA = '';
    this.currentIdx = this.current.length - 1;
    this.notifier.notify('success', 'Card added successfully');
    document.getElementById("focus-area").focus();
  }

  saveCard() {
    const exist = this.saved.filter((card) => card.id == this.currentIdx);
    if(exist.length > 0) {
      const idx = this.saved.indexOf(exist[0]);
      this.saved[idx] = {
        answer: this.popupA,
        question: this.popupQ,
        id: this.currentIdx
      };
    } else {
      this.saved.push({
        answer: this.popupA,
        question: this.popupQ,
        id: this.currentIdx
      })
    }
    this.notifier.notify('success', 'Card saved successfully');

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

  play(id: number) {
    const card = this.savedCards.filter((card) => card.id == id);
    this.current = card[0].cards;
    this.isPopupOpen = true;
    this.isQuestion = true;
    this.currentIdx = 0;
    if(this.current.length > 0) { 
      this.popupQ = this.current[0].question;
      this.popupA = this.current[0].answer;
    }
  }
}
