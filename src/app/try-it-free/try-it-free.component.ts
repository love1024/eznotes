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

  errors = [];

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
  }

  onSubmit() {
    this.termsError = this.confirmError = this.signupError = false;
    if (!this.signupForm.value.terms) {
      this.termsError = true;
    } else if (
      this.signupForm.value.confirmPassword != this.signupForm.value.password
    ) {
      this.confirmError = true;
    } else {
      this.signupError = false;
      this.termsError = false;
      this.confirmError = false;
      this.spinner.show();

      const user: ISignUp = {
        emailAddress: this.signupForm.value.emailAddress,
        password: this.signupForm.value.password,
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName
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
}
