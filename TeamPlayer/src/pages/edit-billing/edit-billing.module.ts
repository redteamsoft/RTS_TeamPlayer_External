import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EditBillingPage } from './edit-billing';

@NgModule({
  declarations: [
    EditBillingPage
  ],
  imports: [
    IonicPageModule.forChild(EditBillingPage),
    TranslateModule.forChild()
  ],
  exports: [
    EditBillingPage
    
  ]
})
export class EditBillingPageModule { }
