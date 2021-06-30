import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListWaiversPage } from './list-waivers';

@NgModule({
  declarations: [
    ListWaiversPage
  ],
  imports: [
    IonicPageModule.forChild(ListWaiversPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListWaiversPage
    
  ]
})
export class ListWaiversPageModule { }
