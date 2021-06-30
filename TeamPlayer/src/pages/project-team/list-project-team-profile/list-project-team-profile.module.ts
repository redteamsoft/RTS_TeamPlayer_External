import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ListProjectTeamProfilePage } from './list-project-team-profile';

@NgModule({
  declarations: [
    ListProjectTeamProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ListProjectTeamProfilePage),
    TranslateModule.forChild(),
  ],
})
export class ListProjectTeamProfilePageModule {}
