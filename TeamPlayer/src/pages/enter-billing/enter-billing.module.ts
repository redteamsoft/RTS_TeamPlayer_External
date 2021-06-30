import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EnterBillingPage } from './enter-billing';

@NgModule({
  declarations: [
    EnterBillingPage
  ],
  imports: [
    IonicPageModule.forChild(EnterBillingPage),
    TranslateModule.forChild()
  ],
  exports: [
    EnterBillingPage
    
  ]
})
export class EnterBillingPageModule { }
