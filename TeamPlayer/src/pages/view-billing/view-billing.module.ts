import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ViewBillingPage } from './view-billing';


@NgModule({
  declarations: [
    ViewBillingPage
  ],
  imports: [
    IonicPageModule.forChild(ViewBillingPage),
    TranslateModule.forChild()
  ],
  exports: [
    ViewBillingPage
  ]
})
export class ViewBillingPageModule { }
