import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { RFQUploadPage } from './rfq-upload';

@NgModule({
  declarations: [
    RFQUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(RFQUploadPage),
    TranslateModule.forChild()
  ],
  exports: [
    RFQUploadPage
  ]
})
export class RFQUploadPageModule { }
