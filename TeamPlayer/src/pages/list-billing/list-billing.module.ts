import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListBillingPage } from './list-billing';

@NgModule({
  declarations: [
    ListBillingPage
  ],
  imports: [
    IonicPageModule.forChild(ListBillingPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListBillingPage
    
  ]
})
export class ListBillingPageModule { }
