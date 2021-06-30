import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListProjectTeamAddPage } from './list-project-team-add';

@NgModule({
  declarations: [
    ListProjectTeamAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ListProjectTeamAddPage),
    TranslateModule.forChild()
  ],
})
export class ListProjectTeamAddPageModule {}
