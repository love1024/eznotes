import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { FileService } from '../service/file/file.service';
import { NotifierService } from 'angular-notifier';
import { LoadingBarService } from '@ngx-loading-bar/core';

declare var RecordRTCPromisesHandler;

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.scss']
})
export class SpeechToTextComponent implements OnInit {
  recorder: any;

  recordingDisabled = true;
  recordingInitiated = false;
  recordingStarted = false;
  recordingPause = false;

  recordStart = false;
  recordingStopped = false;
  stream: any;
  recordingSaved = false;

  recordingVideo = true;

  recordedStream: any;

  fileName = '';

  @ViewChild("videoPlayer") videoPlayer;

  @ViewChild("audoPlayer") audioPlayer;

  player: any;

  constructor(
    private notificationService: NotifierService,
    private fileService: FileService,
    private loadingBar: LoadingBarService) { }

  ngOnInit() {
    if ($(window).width() < 900) {
      $('.feedback-container').removeClass('row justify-content-center');
      $('.review-items').removeClass('col-4');
      $('.review-items').addClass('col-md-8 offset-md-2');
    }
    $(window).resize(() => {
      if ($(window).width() < 900) {
        $('.feedback-container').removeClass('row justify-content-center');
        $('.review-items').removeClass('col-4');
        $('.review-items').addClass('col-md-8 offset-md-2');
      }

      if ($(window).width() > 900) {
        $('.review-items').addClass('col-4');
        $('.feedback-container').addClass('row justify-content-center');
        $('.review-items').removeClass('col-md-8 offset-md-2');
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
    formData.append('file', fileToUpload, fileToUpload.name);

    // 
    this.loadingBar.start();
    this.fileService.uploadFile(formData).subscribe(() => {
      this.loadingBar.complete();  
      this.notificationService.notify('success', 'File Submitted Successfully');
    });
  }

  startRecordingVideo(): void {
    this.recordingVideo = true;
    this.recordingInitiated = true;
    this.recordingDisabled = false;
    this.player = this.videoPlayer;
  }

  startRecordingAudio(): void {
    this.recordingVideo = false;
    this.recordingInitiated = true;
    this.recordingDisabled = false;
    this.player = this.audioPlayer;
  }

  record(): void {
    if(this.recordingVideo) {
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
          type: 'video',
          mimeType: 'video/webm'
        });
        this.recordingStarted = true;
        this.recordingInitiated = false;
        this.recorder.startRecording();
      }).catch((err) => {
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
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        this.stream = stream;
        this.player.nativeElement.srcObject = stream;
        this.recorder = new RecordRTCPromisesHandler(stream, {
          type: 'audio',
          mimeType: 'audio/ogg;codecs=opus'
        });
        this.recordingStarted = true;
        this.recordingInitiated = false;
        this.recorder.startRecording();
      }).catch((err) => {
        this.recordingInitiated = false;
        this.recordingDisabled = true;
      });;
  }

  stopRecording(): void {
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
    formData.append('file', content, `${this.fileName}.webm`);
    this.loadingBar.start();
    this.fileService.uploadFile(formData).subscribe(() => {
      this.loadingBar.complete();
      this.notificationService.notify('success', 'File Submitted Successfully');
    });
   
  }

  saveRecording() {
    this.recordingStopped = false;
    this.recordingDisabled = true;
    this.callApi(this.recordedStream);
  }

  DeleteRecording() {
    this.recordingStopped = false;
    this.recordingDisabled = true;
    this.player.nativeElement.src = this.player.nativeElement.srcObject = null;
    this.fileName = '';
  }
}
