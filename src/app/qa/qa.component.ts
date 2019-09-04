import { Component, OnInit } from '@angular/core';

interface IFlow {
  query: string;
  question: string;
  yesAction: string;
  noAction: string;
  yes?: number,
  no?: number;
}

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QaComponent implements OnInit {

  query = "";

  question = ""

  yesAction = "";

  noAction = "";

  currentPos = 0;

  queries = [
    {
      query: "Enter your text here",
      question: "Do you want to build Cue Cards?",
      yesAction:"Yes",
      noAction: "No",
      yes: 1,
      no: 4
    },
    {
      query: "Please enter your question",
      question: "",
      yesAction:"Submit",
      noAction: "",
      yes: 2
    },
    {
      query: "Please enter your answer",
      question: "",
      yesAction:"Submit",
      noAction: "",
      yes: 3
    },
    {
      query: "",
      question: "Do you have another question?",
      yesAction:"Yes",
      noAction: "No",
      yes: 1,
      no: 5   
    },
    {
      query: "Please type your question",
      question: "",
      yesAction:"Submit",
      noAction: "",
      yes: 5,
      no: -1   
    },
    {
      query: "",
      question: "",
      yesAction:"Save",
      noAction: "Cancel",
      yes: -1,
      no: -1  
    }
  ]

  constructor() { }

  ngOnInit() {
    this.setValues(this.queries[this.currentPos]);
  }

  yes() {
    this.currentPos = this.queries[this.currentPos].yes;
    this.setValues(this.queries[this.currentPos]);
  }

  no() {
    this.currentPos = this.queries[this.currentPos].no;
    this.setValues(this.queries[this.currentPos]);
  }

  setValues(flow: IFlow) {
    this.query = flow.query;
    this.question = flow.question;
    this.yesAction = flow.yesAction;
    this.noAction = flow.noAction;  
  }
}
