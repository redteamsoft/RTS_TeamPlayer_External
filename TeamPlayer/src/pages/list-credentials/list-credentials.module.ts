import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListCredentialsPage } from './list-credentials';

@NgModule({
  declarations: [
    ListCredentialsPage
  ],
  imports: [
    IonicPageModule.forChild(ListCredentialsPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListCredentialsPage
    
  ]
})
export class ListCredentialsPageModule { }
