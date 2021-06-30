import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorUnauthorizedPage } from './error-unauthorized';

@NgModule({
  declarations: [
    ErrorUnauthorizedPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorUnauthorizedPage),
  ],
  exports: [
    ErrorUnauthorizedPage,
  ],
})
export class ErrorUnauthorizedPageModule {}
