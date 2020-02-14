import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TryItFreeComponent } from "./try-it-free/try-it-free.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PricingComponent } from "./pricing/pricing.component";
import { BlogItemComponent } from "./blog-item/blog-item.component";
import { BlogsComponent } from "./blogs/blogs.component";
import { ServicesComponent } from "./services/services.component";
import { SummaryComponent } from "./summary/summary.component";
import { QaSummaryComponent } from "./qa-summary/qa-summary.component";
import { SpeechToTextComponent } from "./speech-to-text/speech-to-text.component";
import { HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { MyFilesComponent } from "./my-files/my-files.component";
import { EditorComponent } from "./editor/editor.component";
// import { TabsModule } from 'ngx-bootstrap/tabs';
import { LiivlabsAcademicComponent } from "./liivlabs-academic/liivlabs-academic.component";
import { LiivlabsMediaComponent } from "./liivlabs-media/liivlabs-media.component";
import { LiivlabsBusinessComponent } from "./liivlabs-business/liivlabs-business.component";
import { LiivlabsLegalComponent } from "./liivlabs-legal/liivlabs-legal.component";
import { VerifyComponent } from "./verify/verify.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetComponent } from "./reset/reset.component";
import { NotifierModule } from "angular-notifier";
import { QaComponent } from "./qa/qa.component";
import { MinuteSecondsPipe } from "./shared/minutesSeconds.pipe";
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { AngularDraggableModule } from "angular2-draggable";
import { NgxPopperModule } from "ngx-popper";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

// import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { LiveTextWindowComponent } from "./live-text-window/live-text-window.component";

// const config: SocketIoConfig = { url: "http://localhost:1337" };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TryItFreeComponent,
    ContactUsComponent,
    PricingComponent,
    BlogItemComponent,
    BlogsComponent,
    ServicesComponent,
    SummaryComponent,
    QaSummaryComponent,
    SpeechToTextComponent,
    HomeComponent,
    MyFilesComponent,
    EditorComponent,
    LiivlabsAcademicComponent,
    LiivlabsMediaComponent,
    LiivlabsBusinessComponent,
    LiivlabsLegalComponent,
    VerifyComponent,
    ForgetPasswordComponent,
    ResetComponent,
    QaComponent,
    MinuteSecondsPipe,
    LiveTextWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NgxSpinnerModule,
    NotifierModule,
    LoadingBarModule,
    AngularDraggableModule,
    // SocketIoModule.forRoot(config),
    NgxPopperModule.forRoot({}),
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger" // set defaults here
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
