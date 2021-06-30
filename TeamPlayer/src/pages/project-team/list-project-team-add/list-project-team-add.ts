import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { ProjectTeam, Metadata, User } from '../../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-list-project-team-add',
  templateUrl: 'list-project-team-add.html',
})
export class ListProjectTeamAddPage {

  teamMembers;
  groupedTeamMembers = [];
  searchQuery: string = '';
  checkedArray = [];
  allNgCheck: boolean;
  checked: boolean;
  hideToolbar: boolean = true;
  loading: any;
  ProjectId: any;
  showNoUsers: boolean = false;
  projectInfo: any = {name: "", number: ""};
  platformName: string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public projectTeam: ProjectTeam,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public metadata: Metadata,
    public platform: Platform,
    public enteredUser: User
  ) {    

    if (this.platform.is('core') || this.platform.is('mobileweb')) {      
      this.platformName = "Browser";
    } else if(this.platform.is('android')){
      this.platformName = "Android";
    } else if(this.platform.is('ios')){
      this.platformName = "iOS";
    }
    
    this.ProjectId = navParams.get('projectid');
    this.projectInfo.name = navParams.get('projectName');
    this.projectInfo.number = navParams.get('projectNum');
    
    if(!this.ProjectId){
      this.navCtrl.setRoot('ListCustomerPage');
    }

    this.initializeItems(this.ProjectId);    
  }
  
  initializeItems(ProjectId) {
    this.loadingControl('generate', null);
    let companyid = window.localStorage.getItem('usercompanyid');
    this.projectTeam.ListAvailableMembers(ProjectId, companyid).subscribe(async resp => {
      if(resp){
        this.teamMembers = resp;
        if(this.teamMembers.length == 0){
          this.showNoUsers = true;
          await this.loadingControl('dismiss', this.loading);
        } else {
          this.teamMembers.forEach(member => {
            member.checked = false;
          });      
          await this.groupTeamMembers(this.teamMembers);
          await this.loadingControl('dismiss', this.loading);
        }
      }else{
        await this.loadingControl('dismiss', this.loading);
      }
    });
  }

  groupTeamMembers(teamMembers){    
    let sortedContacts = teamMembers.sort(function (a, b) {
      if (a.fullname.toUpperCase() < b.fullname.toUpperCase()) { return -1; }
      if (a.fullname.toUpperCase() > b.fullname.toUpperCase()) { return 1; }
      return 0;
    });
    
    let currentLetter = false;
    let currentContacts = [];
    this.groupedTeamMembers = [];

    sortedContacts.forEach((value, index) => {
        if(value.fullname.charAt(0).toUpperCase() != currentLetter){
            currentLetter = value.fullname.charAt(0).toUpperCase();
            let newGroup = {
                letter: currentLetter,
                teamMembers: []
            };
            currentContacts = newGroup.teamMembers;
            this.groupedTeamMembers.push(newGroup);
        } 
        currentContacts.push(value);
    });

  }

  getFilteredItems(ev: any) {        
    let filteredTeamMembers = [];
    const val = ev.target.value;
    
    if (val && val.trim() != '') {
      filteredTeamMembers = this.teamMembers.filter((item) => {         
        return (item.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })      
    }else{
      filteredTeamMembers = this.teamMembers;
    }
    this.groupTeamMembers(filteredTeamMembers);
  }

  checkEvent(e: any, item) {    
    if(e.checked) {      
      this.checkedArray.push({userID: item.PK_UserId_tp, projectTeamID: item.PK_ProjectTeam_tp});      
      const position = this.teamMembers.map(function(e) { return e.PK_UserId_tp; }).indexOf(item.PK_UserId_tp);
      this.teamMembers[position].checked = true;
    } else {
      //const index = this.checkedArray.indexOf(item.PK_UserId_tp);
      const index = this.checkedArray.findIndex(x => x.userID === item.PK_UserId_tp);
      const position = this.teamMembers.map(function(e) { return e.PK_UserId_tp; }).indexOf(item.PK_UserId_tp);
      if (index > -1) {
        this.checkedArray.splice(index, 1);
        this.teamMembers[position].checked = false;
      }
    }    
    
    if(this.checkedArray.length > 0) {
      this.hideToolbar = false;
    } else {
      this.hideToolbar = true;
    }
  }

  footerCancel() {    
    this.checkedArray.forEach(checkedContact => {      
      const position = this.teamMembers.map(function(e) { return e.PK_UserId_tp; }).indexOf(checkedContact.userID);
      this.teamMembers[position].checked = false;
    });
  }

  async footerAdd() {    
    await this.loadingControl('generate', this.loading);    
    
    let params = { userlist: this.checkedArray,  projectid: this.ProjectId, entereduser: this.enteredUser._userid};    
    console.log(params);
    this.projectTeam.AddTeamMembers(params).toPromise()
    .then(
      (result) => {
        var metadataList = result;
        //Insert Metadata        
        let metadataObj = { sourcetype: "ProjectTeam",  userlist: metadataList, description: this.projectInfo.number, status: "Updated", message: this.platformName, action: "Added", actiondbname: null, actionuserid: this.enteredUser._userid};        
        this.metadata.InsertData(metadataObj).subscribe((resp) => {})
        //--
        this.navCtrl.pop();
        this.loadingControl('dismiss', this.loading);              
      },
      (err) => {          
        console.log(err);
        this.loadingControl('dismiss', this.loading);
      }
    );        
    
  }

  openPTProfile(TeamMember) {    
    this.navCtrl.push('ListProjectTeamProfilePage',{ userid: TeamMember.PK_UserId_tp, projecteamid: null });
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

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListProjectTeamAddPage');
  }

}