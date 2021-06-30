import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ListContractDocumentsPage } from './list-contract-documents';

@NgModule({
  declarations: [
    ListContractDocumentsPage
  ],
  imports: [
    IonicPageModule.forChild(ListContractDocumentsPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListContractDocumentsPage
    
  ]
})
export class ListContractDocumentsPageModule { }
