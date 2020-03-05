import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
import { FileService } from "../service/file/file.service";
import { NotifierService } from "angular-notifier";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Socket } from "ngx-socket-io";
import { IFile } from "../models/fileitem";

declare var RecordRTCPromisesHandler;

@Component({
  selector: "app-speech-to-text",
  templateUrl: "./speech-to-text.component.html",
  styleUrls: ["./speech-to-text.component.scss"]
})
export class SpeechToTextComponent implements OnInit {
  recorder: any;

  isRecordingClicked = false;

  recordingDisabled = true;
  recordingInitiated = false;
  recordingStarted = false;
  recordingPause = false;

  recordStart = false;
  recordingStopped = false;
  stream: any;
  recordingSaved = false;

  recordingVideo = false;

  recordedStream: any;

  isSaving = false;

  fileName = "";

  isLiveNotes = false;

  removeLastSentence = false;

  showWarning = false;

  liveTranscriptionInput: any;

  liveTranscriptionProcessor: any;

  liveTranscriptionContext: any;

  @ViewChild("videoPlayer", { static: false }) videoPlayer;

  @ViewChild("audoPlayer", { static: false }) audioPlayer;

  player: any;

  finalText: any;

  constructor(
    private notificationService: NotifierService,
    private fileService: FileService,
    private loadingBar: LoadingBarService,
    private socketEvent: Socket
  ) {
    this.socketEvent.fromEvent("connect").subscribe(e => this.socketConnect(e));
    this.socketEvent
      .fromEvent("messages")
      .subscribe(e => this.socketMessages(e));
    this.socketEvent.fromEvent("speechData").subscribe(e => this.socketData(e));
  }

  ngOnInit() {
    if ($(window).width() < 900) {
      $(".feedback-container").removeClass("row justify-content-center");
      $(".review-items").removeClass("col-4");
      $(".review-items").addClass("col-md-8 offset-md-2");
    }
    $(window).resize(() => {
      if ($(window).width() < 900) {
        $(".feedback-container").removeClass("row justify-content-center");
        $(".review-items").removeClass("col-4");
        $(".review-items").addClass("col-md-8 offset-md-2");
      }

      if ($(window).width() > 900) {
        $(".review-items").addClass("col-4");
        $(".feedback-container").addClass("row justify-content-center");
        $(".review-items").removeClass("col-md-8 offset-md-2");
      }
    });
  }

  /**
   * On file select
   *
   * @param {*} files
   * @memberof SpeechToTextComponent
   */
  onFileSelect(files: File[]): void {
    if (files.length == 0) {
      return;
    }

    let fileToUpload = files[0];
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    this.notificationService.notify(
      "info",
      "Please wait. We are processing file!"
    );

    this.showWarning = true;
    this.isSaving = true;
    this.loadingBar.start();
    this.fileService.uploadFile(formData).subscribe(() => {
      this.loadingBar.complete();
      this.isSaving = false;
      this.showWarning = false;
      this.notificationService.notify("success", "File Processed Successfully");
    });
  }

  startRecordingVideo(): void {
    this.recordingVideo = true;
    this.recordingInitiated = true;
    this.isLiveNotes = false;
    this.isRecordingClicked = true;
    this.recordingDisabled = false;
    this.player = this.videoPlayer;
  }

  startRecordingAudio(): void {
    this.recordingVideo = false;
    this.recordingInitiated = true;
    this.isLiveNotes = false;
    this.isRecordingClicked = true;
    this.recordingDisabled = false;
    this.player = this.audioPlayer;
  }

  startLiveNotes(): void {
    this.recordingInitiated = true;
    this.isRecordingClicked = true;
    this.isLiveNotes = true;
    this.recordingDisabled = false;
    this.player = this.audioPlayer;
    localStorage.setItem("liveText", "");
    const tab = window.open(
      location.origin + "/live-text",
      "",
      "width=1200, height=145"
    );
  }

  record(): void {
    if (this.recordingVideo) {
      this.recordVideo();
    } else {
      this.recordAudio();
    }
  }

  recordVideo(): void {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(stream => {
        this.stream = stream;
        this.player.nativeElement.srcObject = stream;
        this.recorder = new RecordRTCPromisesHandler(stream, {
          type: "video",
          mimeType: "video/webm"
        });
        this.recordingStarted = true;
        this.recordingInitiated = false;
        this.recorder.startRecording();
      })
      .catch(err => {
        console.log(err);
        this.recordingInitiated = false;
        this.recordingDisabled = true;
      });
  }

  pauseVideoRecording(): void {
    this.recordingStarted = false;
    this.recordingPause = true;
    this.recorder.recordRTC.pauseRecording();
  }

  resumeVideoRecording(): void {
    this.recordingPause = false;
    this.recordingStarted = true;
    this.recorder.recordRTC.resumeRecording();
  }

  recordAudio(): void {
    let context, processor;
    if (this.isLiveNotes) {
      this.socketEvent.emit("startGoogleCloudStream", ""); //init socket Google Speech Connection
      let AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      context = new AudioContext({
        latencyHint: "interactive"
      });
      this.liveTranscriptionContext = context;
      processor = context.createScriptProcessor(2048, 1, 1);
      this.liveTranscriptionProcessor = processor;
      processor.connect(context.destination);
      context.resume();
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        this.stream = stream;

        if (this.isLiveNotes) {
          // Live transcription
          let input = context.createMediaStreamSource(stream);
          this.liveTranscriptionInput = input;
          input.connect(processor);
          processor.onaudioprocess = e => {
            this.microphoneProcess(e);
          };
        }

        this.player.nativeElement.srcObject = stream;

        this.recorder = new RecordRTCPromisesHandler(stream, {
          type: "audio",
          mimeType: "audio/ogg;codecs=opus"
        });
        this.recordingStarted = true;
        this.recordingInitiated = false;
        this.recorder.startRecording();
      })
      .catch(err => {
        this.recordingInitiated = false;
        this.recordingDisabled = true;
      });
  }

  stopRecording(): void {
    if (this.isLiveNotes) {
      this.socketEvent.emit("endGoogleCloudStream", "");
      if (this.liveTranscriptionInput) {
        this.liveTranscriptionInput.disconnect(this.liveTranscriptionProcessor);
      }
      this.liveTranscriptionProcessor.disconnect(
        this.liveTranscriptionContext.destination
      );
      this.liveTranscriptionContext.close().then(() => {
        this.liveTranscriptionInput = null;
        this.liveTranscriptionProcessor = null;
        this.liveTranscriptionContext = null;
      });
    }
    this.recorder.stopRecording().then(() => {
      this.recorder.getBlob().then(video => {
        // Asign video to video player
        this.player.nativeElement.src = this.player.nativeElement.srcObject = null;
        this.player.nativeElement.src = URL.createObjectURL(video);

        this.stream.stop();
        this.recordingStopped = true;
        this.recordingStarted = false;
        this.recordedStream = video;
      });
    });
  }

  callApi(content): void {
    const formData = new FormData();
    formData.append("file", content, `${this.fileName}.webm`);
    this.loadingBar.start();
    this.showWarning = true;
    this.fileService.uploadFile(formData).subscribe(() => {
      this.loadingBar.complete();
      this.showWarning = false;
      this.notificationService.notify("success", "File Submitted Successfully");
    });
  }

  callApiForText(): void {
    let resultText = document.getElementById("resultText");
    const file: IFile = {
      originalName: this.fileName,
      text: resultText.innerText
    };
    this.loadingBar.start();
    this.fileService.uploadFileWithText(file).subscribe(() => {
      this.loadingBar.complete();
      this.notificationService.notify("success", "File Submitted Successfully");
    });
  }

  saveRecording() {
    this.recordingStopped = false;
    this.recordingDisabled = true;
    // if (this.isLiveNotes) {
    //   this.callApiForText();
    // } else {
    this.callApi(this.recordedStream);
    // }
  }

  DeleteRecording() {
    this.recordingStopped = false;
    this.recordingDisabled = true;
    this.player.nativeElement.src = this.player.nativeElement.srcObject = null;
    this.fileName = "";
  }

  microphoneProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    // var left16 = convertFloat32ToInt16(left); // old 32 to 16 function
    var left16 = this.downsampleBuffer(left, 44100, 16000);
    this.socketEvent.emit("binaryData", left16);
  }

  downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw "downsampling rate show be smaller than original sample rate";
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (
        var i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  }

  socketConnect(data) {
    this.socketEvent.emit("join", "Server Connected to Client");
  }

  socketMessages(data) {
    console.log(data);
  }

  socketData(data) {
    if (this.recordingPause) {
      return;
    }
    // console.log(data.results[0].alternatives[0].transcript);
    var dataFinal = undefined || data.results[0].isFinal;
    let resultText = document.getElementById("resultText");

    if (dataFinal === false) {
      // console.log(resultText.lastElementChild);
      if (this.removeLastSentence) {
        resultText.lastElementChild.remove();
      }
      this.removeLastSentence = true;

      //add empty span
      let empty = document.createElement("span");
      resultText.appendChild(empty);

      //add children to empty span
      let edit = data.results[0].alternatives[0].transcript.split(" ");

      for (var i = 0; i < edit.length; i++) {
        let newSpan = document.createElement("span");
        newSpan.innerHTML = edit[i];
        resultText.lastElementChild.appendChild(newSpan);
        resultText.lastElementChild.appendChild(
          document.createTextNode("\u00A0")
        );
      }
    } else if (dataFinal === true) {
      resultText.lastElementChild.remove();

      //add empty span
      let empty = document.createElement("span");
      resultText.appendChild(empty);

      //add children to empty span
      let edit = data.results[0].alternatives[0].transcript.split(" ");

      for (var i = 0; i < edit.length; i++) {
        let newSpan = document.createElement("span");
        newSpan.innerHTML = edit[i];
        resultText.lastElementChild.appendChild(newSpan);

        if (i !== edit.length - 1) {
          resultText.lastElementChild.appendChild(
            document.createTextNode("\u00A0")
          );
        }
      }
      resultText.lastElementChild.appendChild(
        document.createTextNode("\u002E\u00A0")
      );

      this.removeLastSentence = false;
    }
    setTimeout(() => {
      let resultText = document.getElementById("resultText");
      localStorage.setItem("liveText", resultText.innerText);
    }, 0);
  }
}
