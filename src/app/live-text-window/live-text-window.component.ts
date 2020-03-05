import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-live-text-window",
  templateUrl: "./live-text-window.component.html",
  styleUrls: ["./live-text-window.component.scss"]
})
export class LiveTextWindowComponent implements OnInit {
  /** Text */
  text: string = "";

  previousHeight = 0;

  intevalId: any;

  constructor() {}

  ngOnInit() {
    var el = document.getElementById("window");
    this.intevalId = setInterval(() => {
      const text = localStorage.getItem("liveText");
      this.text = text ? text : "";
      setTimeout(() => {
        if (el.scrollHeight > this.previousHeight) {
          el.scrollTop = el.scrollHeight;
          this.previousHeight = el.scrollHeight;
        }
      }, 0);
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.intevalId);
  }
}
