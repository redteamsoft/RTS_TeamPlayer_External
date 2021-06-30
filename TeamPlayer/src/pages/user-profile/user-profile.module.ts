import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { UserProfilePage } from './user-profile';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
    TranslateModule.forChild()
  ],
  exports: [
    UserProfilePage
  ]
})
export class SignupPageModule { }
