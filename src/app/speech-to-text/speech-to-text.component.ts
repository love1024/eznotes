import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { FileService } from '../service/file/file.service';

declare var RecordRTCPromisesHandler;

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.scss']
})
export class SpeechToTextComponent implements OnInit {
  recorder: any;
  recordingStarted = false;
  recordingPause = false;
  recordStart = false;
  recordingStopped = false;
  stream: any;
  recordingSaved = false;

  @ViewChild("videoPlayer") player;

  constructor(
    private http: HttpClient,
    private fileService: FileService) {}

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
    if(files.length == 0) {
      return;
    }

    let fileToUpload = files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.fileService.uploadFile(formData).subscribe(() => {
      console.log("HERE");
    });
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
        this.recorder.startRecording();
      });
  }

  pauseVideoRecording(): void {
    this.recordingPause = true;
    this.recorder.recordRTC.pauseRecording();
  }

  resumeVideoRecording(): void {
    this.recordingPause = false;
    this.recorder.recordRTC.resumeRecording();
  }

  recordAudio(): void {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(stream => {
        this.stream = stream;
        this.player.nativeElement.srcObject = stream;
        this.recorder = new RecordRTCPromisesHandler(stream, {
          type: 'audio',
          mimeType: 'audio/ogg;codecs=opus'
        });
        this.recordingStarted = true;
        this.recorder.startRecording();
      });
  }

  stopRecording(): void {
    this.recorder.stopRecording().then(() => {
      this.recorder.getBlob().then(video => {

        // Asign video to video player
        this.player.nativeElement.src = this.player.nativeElement.srcObject = null;
        this.player.nativeElement.src = URL.createObjectURL(video);

      
        this.stream.stop();
        this.recordingStopped = true;
        this.callApi(video);
      });
    });
  }

  callApi(content): void {
    // const reader = new FileReader();
    // reader.readAsDataURL(content);
    // reader.onloadend = () => {
    //   const audio = reader.result;
    //   const audioString = audio.toString().split(',')[1];

      const formData = new FormData();
      formData.append('file', content, 'test.webm');
  
      this.fileService.uploadFile(formData).subscribe(() => {
        console.log("HERE");
      });
    // };
  }

  saveRecording(){
    this.recordingSaved = true;
  }
}
