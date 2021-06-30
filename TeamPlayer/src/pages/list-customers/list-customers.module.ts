import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListCustomerPage } from './list-customers';

@NgModule({
  declarations: [
    ListCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(ListCustomerPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListCustomerPage
  ]
})
export class ListRFQPageModule { }
