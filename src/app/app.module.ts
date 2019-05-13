import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TryItFreeComponent } from './try-it-free/try-it-free.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PricingComponent } from './pricing/pricing.component';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ServicesComponent } from './services/services.component';
import { SummaryComponent } from './summary/summary.component';
import { QaSummaryComponent } from './qa-summary/qa-summary.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MyFilesComponent } from './my-files/my-files.component';

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
    MyFilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
