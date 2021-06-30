import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListProjectTeamPage } from './list-project-team';

@NgModule({
  declarations: [
    ListProjectTeamPage,
  ],
  imports: [
    IonicPageModule.forChild(ListProjectTeamPage),
    TranslateModule.forChild()
  ],
})
export class ListProjectTeamPageModule {}
