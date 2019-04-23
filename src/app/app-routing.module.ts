import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TryItFreeComponent } from './try-it-free/try-it-free.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PricingComponent } from './pricing/pricing.component';
import { PriceInfoComponent } from './price-info/price-info.component';
import { FaqItemComponent } from './faq-item/faq-item.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ServicesComponent } from './services/services.component';
import { SummaryComponent } from './summary/summary.component';
import { QaSummaryComponent } from './qa-summary/qa-summary.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';

const routes: Routes = [
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'qa-summary',
    component: QaSummaryComponent
  },
  // {
  //   path: '',
  //   component: TryItFreeComponent
  // },
  // {
  //   path: '',
  //   component: ContactUsComponent
  // },
  {
    path: '',
    component: SpeechToTextComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
