import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { WorkExperience } from './work-experience/work-experience';
import { Education } from './education/education';
import { Skills } from './skills/skills';
import { Certificates } from './certificates/certificates';
import { Languages } from './languages/languages';
import { Interests } from './interests/interests';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    App,
    Header,
    WorkExperience,
    Education,
    Skills,
    Certificates,
    Languages,
    Interests,
  ],
  imports: [BrowserModule, AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  bootstrap: [App],
})
export class AppModule {}
