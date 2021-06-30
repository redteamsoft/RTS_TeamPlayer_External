import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListUserPage } from './list-users';

@NgModule({
  declarations: [
    ListUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ListUserPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListUserPage
  ]
})
export class ListRFQPageModule { }
