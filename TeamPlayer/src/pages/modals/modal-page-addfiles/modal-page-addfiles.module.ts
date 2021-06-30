import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageAddFiles } from './modal-page-addfiles';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalPageAddFiles,
  ],
  imports: [
    IonicPageModule.forChild(ModalPageAddFiles),
    TranslateModule.forChild()
  ],
  exports: [
    ModalPageAddFiles
  ]
})
export class ModalPageAddFilesModule {}
