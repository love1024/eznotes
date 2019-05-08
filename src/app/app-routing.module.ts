import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TryItFreeComponent } from './try-it-free/try-it-free.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PricingComponent } from './pricing/pricing.component';
import { BlogsComponent } from './blogs/blogs.component';
import { SummaryComponent } from './summary/summary.component';
import { QaSummaryComponent } from './qa-summary/qa-summary.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { AuthService } from './service/auth/auth.service';

const routes: Routes = [
  {
    path: 'summary',
    component: SummaryComponent,
    // canActivate: [AuthService]
  },
  {
    path: 'qa-summary',
    component: QaSummaryComponent,
    canActivate: [AuthService]
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'blog',
    component: BlogsComponent
  },
  {
    path: 'tryFree',
    component: TryItFreeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'contact',
    component: ContactUsComponent
  },
  {
    path: 'speech-to-text',
    component: SpeechToTextComponent,
    canActivate: [AuthService]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
