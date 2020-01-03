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

  constructor() {}

  ngOnInit() {
    var el = document.getElementById("window");
    window.onstorage = e => {
      this.text = e.newValue;
      setTimeout(() => {
        if (el.scrollHeight > this.previousHeight) {
          el.scrollTop = el.scrollHeight;
          this.previousHeight = el.scrollHeight;
        }
      }, 0);
    };
  }
}
