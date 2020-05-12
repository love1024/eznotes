import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../service/user/user.service";
import { IContactUs } from "../models/IContactUs";
import { NotifierService } from "angular-notifier";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"]
})
export class ContactUsComponent implements OnInit {
  form: FormGroup;

  nameError = false;

  emailError = false;

  emailInvalidError = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotifierService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", Validators.required],
      message: [""],
      email: ["", [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    const value = this.form.value;
    this.nameError = this.emailError = this.emailInvalidError = false;
    if (!value.name.trim()) {
      this.nameError = true;
    } else if (!value.email.trim()) {
      this.emailError = true;
    } else if (this.form.get("email").invalid) {
      this.emailInvalidError = true;
    } else {
      const input: IContactUs = {
        email: value.email,
        message: value.message,
        name: value.name
      };
      this.userService.contactUs(input).subscribe(
        () => {
          this.createForm();
          this.notificationService.notify(
            "success",
            "Request sent!, we will contact you soon"
          );
        },
        err => {
          this.notificationService.notify(
            "error",
            "Request not sent because of some error"
          );
        }
      );
    }
  }
}
