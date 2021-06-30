import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { CommitmentDetailPage } from './commitment-detail';
import {FileSizePipe} from "./commitment-detail.pipe";

@NgModule({
  declarations: [
    CommitmentDetailPage,
    FileSizePipe
  ],
  imports: [
    IonicPageModule.forChild(CommitmentDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    CommitmentDetailPage,
    FileSizePipe
  ]
})
export class CommitmentDetailPageModule { }
