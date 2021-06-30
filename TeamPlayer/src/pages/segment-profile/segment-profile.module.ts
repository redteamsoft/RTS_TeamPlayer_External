import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SegmentProfilePage } from './segment-profile';

@NgModule({
  declarations: [
    SegmentProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SegmentProfilePage),
    TranslateModule.forChild()
  ],
  exports: [
    SegmentProfilePage
  ]
})
export class SignupPageModule { }
