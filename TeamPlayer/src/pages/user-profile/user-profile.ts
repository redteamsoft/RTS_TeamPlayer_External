import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController, ModalController, Modal, ModalOptions, Content  } from 'ionic-angular';

import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})

export class UserProfilePage {
  @ViewChild('pageTop') pageTop: Content; 
  item: any;
  public messageString: string;
  public isDisabled: boolean=true; 
  public profileisDisabled: boolean=true;
  public passwordType: string = 'password';
  public passwordIconEye: string = 'md-eye';
  public eyeShow: boolean = false;
  public confirmpasswordType: string = 'password';
  public confirmpasswordIconEye: string = 'md-eye';
  public confirmeyeShow: boolean = false;
  public ClearOnEdit: boolean = false;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    private modal: ModalController,
    public loadingCtrl:LoadingController,
    public translateService: TranslateService, 
    public navParams: NavParams) { 
     this.item = navParams.get('Item')    
  }

  account: { InvitationStatus: string, userposition: string, uAvatarLetter: string, userid: string, firstname: string, lastname: string , mobile: string , email: string , password: string, confirmpassword: string, companyid: string, band: string  } = {
    firstname: this.navParams.get('Item').FirstName ,
    lastname: this.navParams.get('Item').LastName,
    mobile: this.navParams.get('Item').Mobile,
    email: this.navParams.get('Item').Email,
    password: this.navParams.get('Item').UserPass, 
    confirmpassword: this.navParams.get('Item').UserPass, 
    userid: this.navParams.get('Item').UserId,
    uAvatarLetter: this.navParams.get('Item').uAvatarLetter,
    InvitationStatus: this.navParams.get('Item').InvitationStatus,
    userposition: this.navParams.get('Item').Position,
    companyid: this.user._usercompanyid,   
    band: 'profile'
  };

  ionViewWillEnter() {
    if(this.user._userid == this.account.userid){
      this.eyeShow = true;
      this.confirmeyeShow = true;
    }   else{
      this.ClearOnEdit = true;
    }
  }

  togglePassword(num){
    if(num == 1)
      { 
        this.passwordType = this.passwordType == 'password' ? 'text' : 'password';
        this.passwordIconEye = this.passwordIconEye == 'md-eye' ? 'md-eye-off' : 'md-eye';        
      }else{
        this.confirmpasswordType = this.confirmpasswordType == 'password' ? 'text' : 'password';
        this.confirmpasswordIconEye = this.confirmpasswordIconEye == 'md-eye' ? 'md-eye-off' : 'md-eye';
      }    
  }

  showeyeicon(value,num){
    if(this.user._userid == this.account.userid){
      if(num == 1){
        this.eyeShow = (value.length > 0) ? true : false;      
        if(value.length < 1){
          this.passwordType = 'password';      
          this.passwordIconEye = 'md-eye'}
      }else{
        this.confirmeyeShow = (value.length > 0) ? true : false;
        if(value.length < 1){
          this.confirmpasswordType = 'password';      
          this.confirmpasswordIconEye = 'md-eye'}  
      }
    }else{
      if(this.ClearOnEdit)
      { 
        this.account.confirmpassword = "";
        this.account.password = "";
        this.ClearOnEdit = false;
      }
    } 
  }

  openModalHelp(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = '';
    let i = 0;
    const myModal: Modal = this.modal.create('ModalPageHelpCenter', { data: myModalData, line: i }, myModalOptions);
    myModal.present();
  }
  
  editProfile(){
      this.pageTop.scrollToTop();
      this.profileisDisabled = this.profileisDisabled ? false : true; 
      document.getElementById("profileform").className = document.getElementById("profileform").className.replace( /(?:^|\s)profile-padding(?!\S)/g , 'profile-edit-padding' )
      document.getElementById("contentform").className = document.getElementById("contentform").className.replace( /(?:^|\s)bknoform(?!\S)/g , 'bkform' )
  } 
/*
  doCancel(){
    this.navCtrl.pop();
  }
*/
  doSave(){
    this.translateService.get(['LOADING_MESSAGE']).subscribe((value) => {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<div class="spinner-loading"> 
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>` + value.LOADING_MESSAGE
      });
      this.loadingControl('start', loading) 

      let pass = this.account.password;
      let confpass = this.account.confirmpassword;
      let dataRequired = true;
         
      if(this.account.firstname == "")
      {
        dataRequired = false;
        this.translateService.get(['FIRST_NAME_REQUIRED']).subscribe((value) => {
             this.messageString = value.FIRST_NAME_REQUIRED;                
        })
      }
      else if(this.account.lastname == "")
      {
        dataRequired = false;
        this.translateService.get(['LAST_NAME_REQUIRED']).subscribe((value) => {
             this.messageString = value.LAST_NAME_REQUIRED;                
        })
      }
      else if(this.account.email == "")
      {
        dataRequired = false;
        this.translateService.get(['EMAIL_REQUIRED']).subscribe((value) => {
             this.messageString = value.EMAIL_REQUIRED;                
        })
      }
      else if(pass == "")
      {
        dataRequired = false;
        this.translateService.get(['PASSWORD_REQUIRED']).subscribe((value) => {
             this.messageString = value.PASSWORD_REQUIRED;                
        })
      } 
      else if ((pass != confpass) || (pass.trim() == "" && confpass.trim() == "") ){           
        dataRequired = false;
        this.translateService.get(['WRONG_CONFIRM_PASSWORD']).subscribe((value) => {
             this.messageString = value.WRONG_CONFIRM_PASSWORD;                
        })  
      } 

      if(dataRequired)
      {
        this.confirmSave(loading)
      }else{
        this.loadingControl('dismiss', loading) 
        this.doToast(this.messageString);
      }
    });
  }

  async confirmSave(loading: any){
    try {
      await this.user.editInfo(this.account,false);
      this.user._refreshpage = "true";
       this.loadingControl('dismiss', loading) 
       this.pageTop.scrollToTop();
       this.navCtrl.pop();
    } catch (error) {
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.messageString = value.CONNECTION_ERROR;                
      });
     this.doToast(this.messageString);
     this.loadingControl('dismiss', loading);
    }    
  }

  loadingControl(band = '', loading) {
    if(band === 'start')
    {
      loading.present();
    }else{
      loading.dismiss();
    }
  }

  doToast(str){
    let toast = this.toastCtrl.create({
          message: str,
          duration: 3000,
          position: 'top'
        });
        toast.present();
  }
 
}
