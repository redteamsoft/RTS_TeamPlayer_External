import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform  } from 'ionic-angular';
import { ProjectTeam, User, Metadata } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-list-project-team',
  templateUrl: 'list-project-team.html',
})
export class ListProjectTeamPage {

  teamMembers: any;
  checkedArray = [];
  hideToolbar: boolean = true;
  checkAll: boolean;
  loading: any;
  ProjectId: any;
  hideBtnAccess: any = true;
  isPremium: any;
  projectInfo: any = {name: "", number: ""};
  closeBtnLabel = "Close";
  platformName: string = "";

  constructor(
    public user: User,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertController: AlertController,
    public projectTeam: ProjectTeam,
    public metadata: Metadata,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public platform: Platform
  ) {
    this.ProjectId = navParams.get('projectid');    
    if(!this.ProjectId){
      this.navCtrl.setRoot('ListCustomerPage');
    }
    
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.user.ValidateToken().subscribe((resp) => {        
        if (resp[0].Sessions == 0) {
          //console.log("Token invalid");
          this.navCtrl.setRoot('LoginPage');
        } else {
          //console.log(resp[0].Sessions)
        }
      }, (err) => {
        this.navCtrl.setRoot('LoginPage');
      });
      this.platformName = "Browser";
    } else if(this.platform.is('android')){
      this.platformName = "Android";
    } else if(this.platform.is('ios')){
      this.platformName = "iOS";
    }

    this.isPremium = localStorage.getItem('CurrentUserBusinessProduct');    
    if(this.isPremium == '8'){      
      this.hideBtnAccess = this.user.validateUserPermissions("ProjectTeam");
      if(this.hideBtnAccess == "NoAccess")
        this.navCtrl.setRoot('ErrorUnauthorizedPage');
    }

    this.projectInfo.name = navParams.get('projectName');
    this.projectInfo.number = navParams.get('projectNum');
  }

  async initializeItems(ProjectId) {    
    this.loadingControl('generate', this.loading);
    var usercompanyid = localStorage.getItem("usercompanyid");
    await this.projectTeam.ListMembers(ProjectId, usercompanyid).subscribe((resp) => {
      if(resp){
        this.teamMembers = resp;      
        this.teamMembers.forEach(member => {
          member.checked = false;        
        });
      }      
      this.loadingControl('dismiss', this.loading);
    });    
  }

  checkEvent(e: any, item) {    
    if(e.checked) {
      this.checkedArray.push(item.PK_ProjectTeam_tp);
      const position = this.teamMembers.map(function(e) { return e.PK_ProjectTeam_tp; }).indexOf(item.PK_ProjectTeam_tp);
      this.teamMembers[position].checked = true;
    } else {
      const index = this.checkedArray.indexOf(item.PK_ProjectTeam_tp);
      const position = this.teamMembers.map(function(e) { return e.PK_ProjectTeam_tp; }).indexOf(item.PK_ProjectTeam_tp);
      if (index > -1) {
        this.checkedArray.splice(index, 1);
        this.teamMembers[position].checked = false;
      }
    }    
    if(this.checkedArray.length > 0) {
      this.hideToolbar = false;
      this.closeBtnLabel = "Cancel";
    } else {
      this.hideToolbar = true;
      this.closeBtnLabel = "Close";
    }
  }

  footerCancel() {
    
    if(this.checkedArray.length == 0){
      this.navCtrl.pop();      
    }else{    
      this.checkedArray.forEach(ProjectTeamId => {
        const position = this.teamMembers.map(function(e) { return e.PK_ProjectTeam_tp; }).indexOf(ProjectTeamId);
        this.teamMembers[position].checked = false;
      });
    }
    
  }

  async footerRemove() {    
    const confirm = this.alertController.create({
      title: 'Are you sure?',
      message: 'The selected members will be removed from the Project Team.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: async () => {            
            await this.removeMembers();
          }
        }
      ]
    });
    this.alertController.config.set('mode', 'md');

    await confirm.present();
  }

  async removeMembers() {
      var metadataList = this.checkedArray;
      await this.projectTeam.RemoveTeamMembers(this.checkedArray).toPromise()
      .then(
        (result) => {
          //Insert Metadata
          let enteredUserID = this.user._userid;
          let metadataObj = { sourcetype: "ProjectTeam",  userlist: metadataList, description: this.projectInfo.number, status: "Updated", message: this.platformName, action: "Removed", actiondbname: null, actionuserid: enteredUserID};          
          this.metadata.InsertData(metadataObj).subscribe((resp) => {})
          //--
          this.hideToolbar = true;          
          this.initializeItems(this.ProjectId);
          this.closeBtnLabel = "Close";
        },
        (err) => {          
          console.log(err);
        }
      );
    //};    
  }

  loadingControl(band = '', loading) {
    if(band === 'generate') {      
      this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
        this.loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `<div class="spinner-loading"> 
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
          </div>` + value.LOADING_MESSAGE
        });
        this.loadingControl('start', this.loading);
      })
    } else
    if (band === 'start') {      
      loading.present();
    } else {      
      loading.dismiss();
    }
  }

  addProjectTeam() {
    this.navCtrl.push('ListProjectTeamAddPage',{ projectid: this.ProjectId });
  }

  openPTProfile(TeamMember) {    
    this.navCtrl.push('ListProjectTeamProfilePage',{ userid: TeamMember.PK_UserId_tp, projecteamid: TeamMember.PK_ProjectTeam_tp, projectName: this.projectInfo.name, projectNum: this.projectInfo.number });
  }

  ionViewWillEnter() {
    //console.log("Will Enter");
    this.checkedArray = []
    this.initializeItems(this.ProjectId);
    this.hideToolbar = true;    
  }

  ionViewDidEnter() {
    //console.log("Did Enter");
  }

  ionViewDidLeave() {
    //console.log("Did Leave");
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListProjectTeamPage');
  }
}
