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
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { MyFilesComponent } from './my-files/my-files.component';
import { EditorComponent } from './editor/editor.component';
import { LiivlabsAcademicComponent } from './liivlabs-academic/liivlabs-academic.component';
import { LiivlabsLegalComponent } from './liivlabs-legal/liivlabs-legal.component';
import { LiivlabsBusinessComponent } from './liivlabs-business/liivlabs-business.component';
import { LiivlabsMediaComponent } from './liivlabs-media/liivlabs-media.component';

const routes: Routes = [
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [AuthService]
  },
  {
    path: 'editor',
    component: EditorComponent,
    canActivate: [AuthService]
  },
  {
    path: 'myfiles',
    component: MyFilesComponent,
    canActivate: [AuthService]
  },
  {
    path: 'home',
    component: HomeComponent
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
    path: 'liivlabs-academics',
    component: LiivlabsAcademicComponent
  },
  {
    path: 'liivlabs-legal',
    component: LiivlabsLegalComponent
  },
  {
    path: 'liivlabs-business',
    component: LiivlabsBusinessComponent
  },
  {
    path: 'liivlabs-media',
    component: LiivlabsMediaComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'services',
    component: ServicesComponent,
    canActivate: [AuthService]
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
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
