import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
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

  history = [];

  currentTime = 0;

  highlight = "highlight";

  completeTranscript = "";

  isPaused = true;

  isMute = false;

  playbackRate = 1;

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

  anyHighlighted = false;

  highlightShow = false;

  strikeOutShow = false;

  undoShow = false;

  highlightedIndex = 0;

  highlightedItems = [];

  timeoutSub = undefined;

  fileName: string = "";

  currentUserEmail = "";

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
      this.currentUserEmail = params["email"];
      this.fileService.getFileUrl(fileName).subscribe(res => {
        this.videoUrl = res.url;
      });
      this.fileService
        .getFile(fileName, this.currentUserEmail)
        .subscribe(res => {
          this.file = res;
          this.fileName = res.originalName;
          this.filetexts = JSON.parse(res.text);
          this.changedText = JSON.parse(res.text);
          this.getCompleteFileTranscript();
          this.history.push(JSON.parse(JSON.stringify(this.filetexts)));
          this.findHighlightItems();
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

  findHighlightItems(): void {
    this.highlightedItems = [];
    this.filetexts.forEach(filetext => {
      filetext.Alternatives[0].Words.map(word => {
        if (word.highlight && word.highlightStart && word.highlightEnd) {
          this.highlightedItems.push(word);
        }
      });
    });
    if (this.highlightedItems.length > 0) {
      this.anyHighlighted = true;
    } else {
      this.anyHighlighted = false;
    }
  }

  startHighlight() {
    let nativeElement = this.videoplayer.nativeElement;
    if (this.highlightedIndex < this.highlightedItems.length) {
      const currentWord = this.highlightedItems[this.highlightedIndex];
      const currentStart = currentWord.highlightStart;
      const currentEnd = currentWord.highlightEnd;
      nativeElement.currentTime = currentStart;
      nativeElement.play();
      this.isPaused = false;
      if (!this.isPaused) {
        this.timeoutSub = setTimeout(() => {
          nativeElement.pause();
          this.isPaused = true;
          this.highlightedIndex++;
          this.startHighlight();
        }, (currentEnd - currentStart) * 1000 + 200);
      }
    } else {
      this.highlightedIndex = 0;
    }
  }

  highlightText(event) {
    const time = event.currentTarget.currentTime;
    this.currentTime = time;

    let els = document.getElementsByClassName("highlight");
    if (els.length > 0 && this.readAlong) {
      const el = els[0];
      el.scrollIntoView(false);
    }
  }

  toggleVideo() {
    let nativeElement = this.videoplayer.nativeElement;
    if (nativeElement.paused) {
      this.isPaused = false;
      nativeElement.play();
      if (this.anyHighlighted) {
        this.startHighlight();
      }
    } else {
      this.isPaused = true;
      clearInterval(this.timeoutSub);
      nativeElement.pause();
    }
  }

  toggleSpeed() {
    let nativeElement = this.videoplayer.nativeElement;
    this.playbackRate = (this.playbackRate + 0.5) % 2.5;
    if (this.playbackRate == 0) {
      this.playbackRate = 0.5;
    }
    nativeElement.playbackRate = this.playbackRate;
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

  onContentChange(save: boolean = true) {
    let els = document.getElementsByClassName("text-content");

    let filetexts = JSON.parse(JSON.stringify(this.filetexts));
    if (save) {
      this.history.push(JSON.parse(JSON.stringify(filetexts)));
      this.undoShow = true;
    }
    for (let i = 0; i < els.length; i++) {
      let element = els[i] as HTMLSpanElement;
      let html = element.innerText.replace(/&nbsp;|nbsp;|&amp;|amp;/g, "");

      let alternativesIndex = element.dataset.outerindex;
      let wordIndex = element.dataset.innerindex;

      filetexts[alternativesIndex].Alternatives[0].Words[wordIndex].Word = html;
    }

    this.onSpeakerEdit(filetexts);

    let data = { Text: JSON.stringify(filetexts) };
    this.lastModified = new Date();
    this.lastModifiedText = "Saving...";

    this.isSaving = true;
    this.fileService
      .changeFileText(data, this.file.videoFileName, this.currentUserEmail)
      .subscribe(res => {
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
      filetexts[alternativesIndex].Alternatives[0].Words[0].SpeakerTag = html;
    }
  }

  updateVideoTime(event) {
    let currentTarget = event.currentTarget as HTMLElement;
    if (!this.anyHighlighted) {
      let timeOfSpan = currentTarget.dataset.time;
      let nativeElement = this.videoplayer.nativeElement;
      nativeElement.currentTime = timeOfSpan;
    } else {
      if (currentTarget.classList.contains("highlight-yellow")) {
        this.highlightShow = true;
      } else {
        this.highlightShow = false;
      }
      if (currentTarget.classList.contains("cut")) {
        this.strikeOutShow = true;
      } else {
        this.strikeOutShow = false;
      }
    }
  }

  toggleFindAndReplace() {
    let state = this.findReplaceShow;
    this.findReplaceShow = !state;
  }

  findAllOccurences() {
    this.allOccurences = [];
    this.currentIndexOfWord = 0;
    this.outerIndexOfWord = -1;
    this.innerIndexOfWord = -1;
    this.filetexts.map((item, outerIndex) => {
      if (
        item.Alternatives[0].Words[0].SpeakerTag != undefined &&
        item.Alternatives[0].Words[0].SpeakerTag != null
      ) {
        if (
          (item.Alternatives[0].Words[0].SpeakerTag + "")
            .trim()
            .toLowerCase() == this.findWord.toLowerCase()
        ) {
          this.allOccurences.push(`${outerIndex}:-1`);
        }
      }
      item.Alternatives[0].Words.map((word, innerIndex) => {
        if (word.Word.trim().toLowerCase() == this.findWord.toLowerCase()) {
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

    if (this.innerIndexOfWord == -1) {
      //updating speaker
      this.filetexts[
        alternativesIndex
      ].Alternatives[0].Words[0].SpeakerTag = this.replaceWord;
    } else {
      // updating the current text
      this.filetexts[alternativesIndex].Alternatives[0].Words[
        wordIndex
      ].Word = this.replaceWord;
    }

    let data = { Text: JSON.stringify(this.filetexts) };
    this.fileService
      .changeFileText(data, this.file.videoFileName, this.currentUserEmail)
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
      if (this.innerIndexOfWord == -1) {
        this.filetexts[
          alternativesIndex
        ].Alternatives[0].Words[0].SpeakerTag = this.replaceWord;
      } else {
        // updating the current text
        this.filetexts[alternativesIndex].Alternatives[0].Words[
          wordIndex
        ].Word = this.replaceWord;
      }
    });
    let data = { Text: JSON.stringify(this.filetexts) };

    this.fileService
      .changeFileText(data, this.file.videoFileName, this.currentUserEmail)
      .subscribe(res => {});
    this.findAllOccurences();
  }

  highlightWordFound(index) {
    let indexes = index.split(":");
    this.outerIndexOfWord = indexes[0];
    this.innerIndexOfWord = indexes[1];
  }

  onHighlightClick() {
    this.history.push(JSON.parse(JSON.stringify(this.changedText)));
    this.undoShow = true;
    const els = document.getSelection().getRangeAt(0);
    this.highlightedIndex = 0;

    let first: any = els.startContainer.parentElement;
    let last: any = els.endContainer.parentElement;
    this.filetexts[first.dataset.outerindex].Alternatives[0].Words[
      first.dataset.innerindex
    ].highlightStart = first.dataset.time;
    this.filetexts[first.dataset.outerindex].Alternatives[0].Words[
      first.dataset.innerindex
    ].highlightEnd = last.dataset.endtime;

    while (first !== last.nextElementSibling) {
      let alternativesIndex = first.dataset.outerindex;
      let wordIndex = first.dataset.innerindex;

      const already = this.filetexts[alternativesIndex].Alternatives[0].Words[
        wordIndex
      ].highlight;
      const alreadycut = this.filetexts[alternativesIndex].Alternatives[0]
        .Words[wordIndex].cut;

      if (already) {
        this.assignHighlight(alternativesIndex, wordIndex, false);
        this.highlightShow = false;
      } else {
        this.assignHighlight(alternativesIndex, wordIndex, true);
        this.highlightShow = true;
        if (alreadycut) {
          this.assignStrike(alternativesIndex, wordIndex, false);
        }
      }
      first = first.nextElementSibling;
    }
    this.findHighlightItems();
    this.onContentChange(false);
  }

  onStrikeClick() {
    this.history.push(JSON.parse(JSON.stringify(this.changedText)));
    this.undoShow = true;
    const els = document.getSelection().getRangeAt(0);

    let first: any = els.startContainer.parentElement;
    let last: any = els.endContainer.parentElement;

    while (first !== last.nextElementSibling) {
      let alternativesIndex = first.dataset.outerindex;
      let wordIndex = first.dataset.innerindex;

      const already = this.filetexts[alternativesIndex].Alternatives[0].Words[
        wordIndex
      ].cut;
      const alreadyHighlight = this.filetexts[alternativesIndex].Alternatives[0]
        .Words[wordIndex].highlight;
      if (already) {
        this.assignStrike(alternativesIndex, wordIndex, false);
        this.strikeOutShow = false;
      } else {
        this.assignStrike(alternativesIndex, wordIndex, true);
        this.strikeOutShow = false;
        if (alreadyHighlight) {
          this.assignHighlight(alternativesIndex, wordIndex, false);
        }
      }
      first = first.nextElementSibling;
    }
    this.onContentChange(false);
  }

  assignStrike(alternativesIndex, wordIndex, value) {
    this.filetexts[alternativesIndex].Alternatives[0].Words[
      wordIndex
    ].cut = value;
  }

  assignHighlight(alternativesIndex, wordIndex, value) {
    this.filetexts[alternativesIndex].Alternatives[0].Words[
      wordIndex
    ].highlight = value;
  }

  goToRoute(route) {
    this.getCompleteFileTranscript();
    this.summaryService.textEmitter.next(this.completeTranscript);
    const queryParams: NavigationExtras = {
      queryParams: {
        id: this.file.videoFileName,
        email: this.currentUserEmail
      }
    };
    switch (route) {
      case "Summary": {
        this.router.navigate(["summary"], queryParams);
        break;
      }
      case "QA": {
        this.router.navigate(["qa-summary"], queryParams);
      }
    }
  }

  undoClick() {
    if (this.history.length == 2) {
      this.undoShow = false;
    }
    if (this.history.length > 0) {
      this.filetexts = this.history.pop();
      this.highlightShow = false;
      this.onContentChange(false);
      this.findHighlightItems();
    }
  }
}
