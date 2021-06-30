import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalsTermsConditionsPage } from './modals-terms-conditions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalsTermsConditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalsTermsConditionsPage),
    TranslateModule.forChild()
  ],
})
export class ModalsTermsConditionsPageModule {}
