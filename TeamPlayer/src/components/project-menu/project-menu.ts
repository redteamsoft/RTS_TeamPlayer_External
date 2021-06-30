import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'project-menu',
  templateUrl: 'project-menu.html'
})
export class ProjectMenuComponent {

  TeamMemberstext: string;
  data: any;  

  constructor(
    public viewCtrl: ViewController, 
    public navParams:NavParams,
    public navCtrl: NavController,
  ) {    
    this.TeamMemberstext = 'Project Menu TeamMembers';
    this.data = this.navParams.data;
  }

  openProjectTeam(){    
    this.viewCtrl.dismiss({ action: "ProjectTeam", projectid: this.data.projectID });
  }
}
