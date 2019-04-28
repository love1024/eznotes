import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { TryItFreeComponent } from './try-it-free/try-it-free.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PricingComponent } from './pricing/pricing.component';
import { PriceInfoComponent } from './price-info/price-info.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { FaqItemComponent } from './faq-item/faq-item.component';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ServicesComponent } from './services/services.component';
import { ServiceItemComponent } from './service-item/service-item.component';
import { ServiceItemIconComponent } from './service-item-icon/service-item-icon.component';
import { SummaryComponent } from './summary/summary.component';
import { QaSummaryComponent } from './qa-summary/qa-summary.component';
import { SummaryItemComponent } from './summary-item/summary-item.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { SpeechToTextItemComponent } from './speech-to-text-item/speech-to-text-item.component';
import { FeedbackItemComponent } from './feedback-item/feedback-item.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TryItFreeComponent,
    ContactUsComponent,
    PricingComponent,
    PriceInfoComponent,
    TeamInfoComponent,
    FaqItemComponent,
    BlogItemComponent,
    BlogsComponent,
    ServicesComponent,
    ServiceItemComponent,
    ServiceItemIconComponent,
    SummaryComponent,
    QaSummaryComponent,
    SummaryItemComponent,
    SpeechToTextComponent,
    SpeechToTextItemComponent,
    FeedbackItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
