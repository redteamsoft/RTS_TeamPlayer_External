import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { LoginProfilePage } from './login-profile';

@NgModule({
  declarations: [
    LoginProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginProfilePage),
    TranslateModule.forChild()
  ],
  exports: [
    LoginProfilePage
  ]
})
export class SignupPageModule { }
