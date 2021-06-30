import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { AccountDetailPage } from './account-detail';

@NgModule({
  declarations: [
    AccountDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    AccountDetailPage
  ]
})
export class AccountDetailPageModule { }
