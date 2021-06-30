import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { RFQDetailPage } from './rfq-detail';

@NgModule({
  declarations: [
    RFQDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RFQDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    RFQDetailPage
  ]
})
export class RFQDetailPageModule { }
