import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListProjectPage } from './list-projects';

@NgModule({
  declarations: [
    ListProjectPage,
  ],
  imports: [
    IonicPageModule.forChild(ListProjectPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListProjectPage
  ]
})
export class ListRFQPageModule { }
