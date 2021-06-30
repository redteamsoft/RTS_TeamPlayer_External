import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListTransactionPage } from './list-transactions';

@NgModule({
  declarations: [
    ListTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(ListTransactionPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListTransactionPage
  ]
})
export class ListTransactionPageModule { }
