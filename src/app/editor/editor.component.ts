import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IFile } from "../models/fileitem";
import { FileService } from "../service/file/file.service";
import { SummaryService } from "../service/summary/summary.service";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit {
  @ViewChild("videoPlayer") videoplayer: ElementRef;

  tab = "textSummary";

  videoUrl = "";

  file: IFile;

  filetexts = [];

  currentTime = 0;

  highlight = "highlight";

  completeTranscript = "";

  isPaused = false;

  isMute = false;

  isSpeedFast = false;

  spanEdited = "";

  findReplaceShow = false;

  findWord = "";

  allOccurences = [];

  outerIndexOfWord = -1;

  innerIndexOfWord = -1;

  currentIndexOfWord = 0;

  replaceWord = "";

  lastModified = new Date();

  lastModifiedText = "";

  timeAgo = new TimeAgo();

  isSaving = false;

  readAlong = true;

  changedText = [];

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private router: Router,
    private summaryService: SummaryService
  ) {
    this.lastModifiedText = `Last saved ${this.timeAgo.format(
      this.lastModified
    )}`;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const fileName = params["id"];
      this.fileService.getFileUrl(fileName).subscribe(res => {
        this.videoUrl = res.url;
      });
      this.fileService.getFile(fileName).subscribe(res => {
        this.file = res;
        this.filetexts = JSON.parse(res.text);
        this.changedText = JSON.parse(res.text);
        this.getCompleteFileTranscript();
      });
    });

    setInterval(() => {
      if (!this.isSaving) {
        this.lastModifiedText = `Last saved ${this.timeAgo.format(
          this.lastModified
        )}`;
      }
    }, 3000);
  }

  setTab(tabName) {
    this.tab = tabName;
  }

  highlightText(event) {
    this.currentTime = event.currentTarget.currentTime;
  }

  toggleVideo() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.paused) {
      this.isPaused = false;
      nativeElement.play();
    } else {
      this.isPaused = true;
      nativeElement.pause();
    }
  }

  toggleSpeed() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.playbackRate == 1.0) {
      this.isSpeedFast = true;
      nativeElement.playbackRate = 2.0;
    } else {
      this.isSpeedFast = false;
      nativeElement.playbackRate = 1.0;
    }
  }

  toggleAudio() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.muted) {
      this.isMute = false;
      nativeElement.muted = false;
    } else {
      this.isMute = true;
      nativeElement.muted = true;
    }
  }

  rewind5Sec() {
    let nativeElement = this.videoplayer.nativeElement;
    nativeElement.currentTime -= 5;
  }

  getCompleteFileTranscript() {
    this.completeTranscript = "";
    this.changedText.forEach(filetext => {
      filetext.Alternatives[0].Words.map((word, innerIndex) => {
        this.completeTranscript = this.completeTranscript + word.Word + " ";
      });
    });
  }

  onContentChange() {
    let els = document.getElementsByClassName("text-content");

    let filetexts = JSON.parse(JSON.stringify(this.filetexts));
    for (let i = 0; i < els.length; i++) {
      let element = els[i] as HTMLSpanElement;
      let html = element.innerText.replace(/&nbsp;|nbsp;|&amp;|amp;/g, "");

      let alternativesIndex = element.dataset.outerindex;
      let wordIndex = element.dataset.innerindex;

      filetexts[alternativesIndex].Alternatives[0].Words[wordIndex].Word = html;
      if (element.classList.contains("highlight-yellow")) {
        filetexts[alternativesIndex].Alternatives[0].Words[
          wordIndex
        ].highlight = true;
      } else {
        filetexts[alternativesIndex].Alternatives[0].Words[
          wordIndex
        ].highlight = false;
      }

      if (element.classList.contains("cut")) {
        filetexts[alternativesIndex].Alternatives[0].Words[
          wordIndex
        ].cut = true;
      } else {
        filetexts[alternativesIndex].Alternatives[0].Words[
          wordIndex
        ].cut = false;
      }
    }

    this.onSpeakerEdit(filetexts);

    // let filetexts = JSON.parse(JSON.stringify(this.filetexts));
    let data = { Text: JSON.stringify(filetexts) };
    this.lastModified = new Date();
    this.lastModifiedText = "Saving...";

    this.isSaving = true;
    this.fileService.changeFileText(data, this.file.fileId).subscribe(res => {
      this.isSaving = false;
      this.changedText = filetexts;
    });
  }

  onSpeakerEdit(filetexts: any) {
    let els = document.getElementsByClassName("text-content-header");
    for (let i = 0; i < els.length; i++) {
      let element = els[i] as HTMLSpanElement;
      let html = element.innerText.replace(/&nbsp;|nbsp;|&amp;|amp;/g, "");
      let alternativesIndex = element.dataset.outerindex;

      filetexts[alternativesIndex].Alternatives[0].SpeakerName = html;
    }
  }

  updateVideoTime(event) {
    let currentTarget = event.currentTarget;
    let timeOfSpan = currentTarget.dataset.time;
    let nativeElement = this.videoplayer.nativeElement;
    nativeElement.currentTime = timeOfSpan;
  }

  toggleFindAndReplace() {
    let state = this.findReplaceShow;
    this.findReplaceShow = !state;
  }

  findAllOccurences() {
    this.allOccurences = [];
    this.currentIndexOfWord = 0;
    this.filetexts.map((item, outerIndex) => {
      item.Alternatives[0].Words.map((word, innerIndex) => {
        if (word.Word.trim() == this.findWord) {
          this.allOccurences.push(`${outerIndex}:${innerIndex}`);
        }
      });
    });
    if (this.allOccurences.length > 0) {
      this.highlightWordFound(this.allOccurences[this.currentIndexOfWord]);
    }
  }

  findNextOccurence() {
    if (this.currentIndexOfWord < this.allOccurences.length - 1) {
      this.currentIndexOfWord += 1;
      this.highlightWordFound(this.allOccurences[this.currentIndexOfWord]);
    }
  }

  findPreviousOccurence() {
    if (this.currentIndexOfWord > 0) {
      this.currentIndexOfWord -= 1;
      this.highlightWordFound(this.allOccurences[this.currentIndexOfWord]);
    }
  }

  replaceCurrentWord() {
    let alternativesIndex = this.outerIndexOfWord;
    let wordIndex = this.innerIndexOfWord;
    // updating the current text
    this.filetexts[alternativesIndex].Alternatives[0].Words[
      wordIndex
    ].Word = this.replaceWord;
    let data = { Text: JSON.stringify(this.filetexts) };
    this.fileService
      .changeFileText(data, this.file.fileId)
      .subscribe(res => {});
    this.findAllOccurences();
  }

  replaceAllWords() {
    this.allOccurences.map(item => {
      let indexes = item.split(":");
      this.outerIndexOfWord = indexes[0];
      this.innerIndexOfWord = indexes[1];
      let alternativesIndex = this.outerIndexOfWord;
      let wordIndex = this.innerIndexOfWord;
      // updating the current text
      this.filetexts[alternativesIndex].Alternatives[0].Words[
        wordIndex
      ].Word = this.replaceWord;
    });
    let data = { Text: JSON.stringify(this.filetexts) };
    this.fileService
      .changeFileText(data, this.file.fileId)
      .subscribe(res => {});
    this.findAllOccurences();
  }

  highlightWordFound(index) {
    let indexes = index.split(":");
    this.outerIndexOfWord = indexes[0];
    this.innerIndexOfWord = indexes[1];
  }

  onHighlightClick() {
    let els = document.getElementsByClassName("highlight");
    if (els && els.length > 0) {
      const already = els[0].classList.contains("highlight-yellow");
      if (already) {
        els[0].classList.remove("highlight-yellow");
      } else {
        els[0].classList.add("highlight-yellow");
      }
    }
    this.onContentChange();
  }

  onStrikeClick() {
    let els = document.getElementsByClassName("highlight");
    if (els && els.length > 0) {
      const already = els[0].classList.contains("cut");
      if (already) {
        els[0].classList.remove("cut");
      } else {
        els[0].classList.add("cut");
      }
    }
    this.onContentChange();
  }

  goToRoute(route) {
    this.getCompleteFileTranscript();
    this.summaryService.textEmitter.next(this.completeTranscript);
    switch (route) {
      case "Summary": {
        this.router.navigateByUrl("summary");
        break;
      }
      case "QA": {
        this.router.navigateByUrl("qa-summary");
      }
    }
  }
}
