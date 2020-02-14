import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoginService } from "../service/login/login.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ISignUp, ISignUpResult } from "../models/signup";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { UserService } from "../service/user/user.service";

@Component({
  selector: "app-try-it-free",
  templateUrl: "./try-it-free.component.html",
  styleUrls: ["./try-it-free.component.scss"]
})
export class TryItFreeComponent implements OnInit {
  termsError = false;

  confirmError = false;

  signupForm: FormGroup;

  signupError = false;

  emptyInstitueError = false;

  emptyProfessorError = false;

  errors = [];

  dropdownListInstitutes = [];

  dropdownListProfessors = [];

  selectedInstitute = [];

  selectedProfessors = [];

  dropdownSettingsInstitute: IDropdownSettings = {};

  dropdownSettingsProfessor: IDropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      emailAddress: ["", Validators.required],
      password: ["", Validators.required],
      confirmPassword: [""],
      terms: [false]
    });

    this.dropdownSettingsInstitute = {
      singleSelection: true,
      idField: "id",
      textField: "value",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownSettingsProfessor = {
      singleSelection: false,
      idField: "id",
      textField: "value",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.userService.getAllInstitutes().subscribe(institutes => {
      this.dropdownListInstitutes = institutes.map(inst => {
        return { id: inst.userId, value: `${inst.firstName} ${inst.lastName}` };
      });
    });
  }

  onSubmit() {
    this.termsError = this.confirmError = this.emptyInstitueError = this.emptyProfessorError = this.signupError = false;
    if (!this.signupForm.value.terms) {
      this.termsError = true;
    } else if (
      this.signupForm.value.confirmPassword != this.signupForm.value.password
    ) {
      this.confirmError = true;
    } else if (this.selectedInstitute.length == 0) {
      this.emptyInstitueError = true;
    } else if (this.selectedProfessors.length == 0) {
      this.emptyProfessorError = true;
    } else {
      this.signupError = false;
      this.termsError = false;
      this.confirmError = false;
      this.spinner.show();

      let follow = "";
      this.selectedProfessors.forEach(inst => {
        follow += `${inst.id}, `;
      });

      const user: ISignUp = {
        emailAddress: this.signupForm.value.emailAddress,
        password: this.signupForm.value.password,
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        parentUserId: this.selectedInstitute[0].id,
        follow: follow
      };

      this.loginService.signUp(user).subscribe(
        (res: ISignUpResult) => {
          this.loginService.sendEmail(res.emailAddress).subscribe(
            () => {
              this.router.navigateByUrl("/verify");
            },
            err => (this.errors = err.error.message)
          );
        },
        err => {
          this.errors = err.error.message;
          this.spinner.hide();
        }
      );
    }
  }

  onKeydown(event) {
    if (event.key == "Enter") {
      this.onSubmit();
    }
  }

  onInstituteSelect(event): void {
    this.spinner.show();
    this.userService.getAllProfessors(event.id).subscribe(professors => {
      this.dropdownListProfessors = professors.map(inst => {
        return { id: inst.userId, value: `${inst.firstName} ${inst.lastName}` };
      });
      this.spinner.hide();
    });
  }
}
