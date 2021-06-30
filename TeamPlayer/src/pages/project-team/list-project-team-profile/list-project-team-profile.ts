import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectTeam, User } from '../../../providers';
import { IonicPage, NavController, NavParams, ModalController, Modal, ModalOptions, LoadingController } from 'ionic-angular';

/**
 * Generated class for the ListProjectTeamProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-project-team-profile',
  templateUrl: 'list-project-team-profile.html',
})
export class ListProjectTeamProfilePage {

  UserId: any;
  ProjectTeamId: any;
  TeamMemberInfo: any;
  FirstName_tp: String;
  LastName_tp: String;
  Position_tp: String;
  Mobile_tp: String;
  Email_tp: String;
  CompanyName_tp: String;
  LevelAccess_tp: String;
  TeamAddedDate_tp: Date;
  TeamInvitedDate_tp: String;
  inv_FirstName_tp: String;
  inv_LastName_tp: String;
  profilePic_tp: String;
  projectTeamID: any;
  checked: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public translateService: TranslateService,
    private modal: ModalController,
    public projectTeam: ProjectTeam,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public enteredUser: User
  ) {
    this.UserId = navParams.get('userid');    
    if(!this.UserId)
      this.navCtrl.setRoot('ListCustomerPage');          
    else{
      this.ProjectTeamId = navParams.get('projecteamid');
      this.initializeItems(this.UserId);
    }      
  }

  openModalHelp() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = '';
    let i = 0;
    const myModal: Modal = this.modal.create('ModalPageHelpCenter', { data: myModalData, line: i }, myModalOptions);
    myModal.present();
  }

  async initializeItems(UserID) {        
    this.loadingControl('generate', null);
    await this.projectTeam.TeamMemberInfo(UserID, this.ProjectTeamId).subscribe((resp) => {
      
      this.TeamMemberInfo = resp;
      
      this.projectTeamID = this.TeamMemberInfo.PK_ProjectTeam_tp;
      this.FirstName_tp = this.TeamMemberInfo.FirstName_tp;
      this.LastName_tp = this.TeamMemberInfo.LastName_tp;
      this.Position_tp = this.TeamMemberInfo.Position_tp;
      this.Mobile_tp = this.TeamMemberInfo.Mobile_tp;
      this.Email_tp = this.TeamMemberInfo.Email_tp;
      this.CompanyName_tp = this.TeamMemberInfo.CompanyName_tp;
      this.LevelAccess_tp = this.TeamMemberInfo.LevelAccess_tp;
      this.TeamAddedDate_tp = this.TeamMemberInfo.TeamAddedDate_tp;
      this.TeamInvitedDate_tp = this.TeamMemberInfo.TeamInvitedDate_tp;
      this.inv_FirstName_tp = this.TeamMemberInfo.inv_FirstName_tp;
      this.inv_LastName_tp = this.TeamMemberInfo.inv_LastName_tp;
      this.profilePic_tp = this.FirstName_tp.charAt(0)+this.LastName_tp.charAt(0);
      
      if(this.LevelAccess_tp == 'Added' && this.TeamAddedDate_tp != null){
        this.checked = true;
      }

      this.loadingControl('dismiss', this.loading);
    });
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

  async checkEvent(e: any) {
    this.loadingControl('generate', null);
    var action;
    
    if(e.checked) {      
      action = "upgrade";
    }else{
      action = "downgrade";
    }
    
    let params = { projectteamid: this.projectTeamID, entereduser: this.enteredUser._userid, action: action};

    await this.projectTeam.TeamMemberUpdate(params).subscribe((resp) => {      
      this.loadingControl('dismiss', this.loading);
      this.initializeItems(this.UserId);
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListProjectTeamProfilePage');
  }

}
