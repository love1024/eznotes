import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var RecordRTCPromisesHandler;

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.scss']
})
export class SpeechToTextComponent implements OnInit {

  recorder: any;

  stream: any;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  recordVideo(): void {
    const player = document.getElementById('player') as HTMLVideoElement;

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.stream = stream;
        player.srcObject = stream;
        this.recorder = new RecordRTCPromisesHandler(stream, {
            type: 'audio',
            mimeType: 'audio/ogg;codecs=opus',
        });
        this.recorder.startRecording();
      });
  }

  stopRecording(): void {
    this.recorder.stopRecording()
      .then(() => {
        this.recorder.getBlob()
          .then((video) => {
            this.stream.stop();
            this.callApi(video);
          })
      });
  }

  callApi(content): void {
    let reader = new FileReader();
    reader.readAsDataURL(content)
    reader.onloadend = () => {
      const audio = reader.result;
      const audioString = audio.toString().split(',')[1];
    
      const url = 'https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyC4m17AKTUPzyL0DiFZNosOKJm9uMXEeXk';
      const options = {
        config: {
          encoding:"OGG_OPUS",
          languageCode: 'en-US',
          sampleRateHertz: 48000
        },
        audio: {
          content: audioString
        }
      }
      this.http.post(url, options).subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    }
  }
}
