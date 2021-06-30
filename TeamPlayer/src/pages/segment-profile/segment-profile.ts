import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController, ModalController, Modal, ModalOptions, Content } from 'ionic-angular';

import { User } from '../../providers'; 

@IonicPage()
@Component({
  selector: 'page-segment-profile',
  templateUrl: 'segment-profile.html'
})

export class SegmentProfilePage {
  @ViewChild('pageTop') pageTop: Content; 
  account: { companyid: string, userid: string, userposition: string, companyname: string, address: string, city: string, stateorprovince: string, zipcode: string, country: string, webpage: string, phonenumber: string, firstname: string, lastname: string , mobile: string , email: string , password: string, confirmpassword: string, band: string  } = {
    companyname: this.user._companyname,
    address: this.user._useraddress,
    city: this.user._usercity,
    stateorprovince: this.user._userstateorprovince,
    zipcode: this.user._userzipcode,
    country: this.user._usercountry, 
    webpage: this.user._userwebpage,
    phonenumber: this.user._userphonenumber,
    firstname: this.user._userfirstname,
    lastname: this.user._userlastname,
    mobile: this.user._usermobile,
    email: this.user._useremail,
    password: this.user._userpass, 
    confirmpassword: this.user._userpass,
    companyid: this.user._usercompanyid,
    userid: this.user._userid,
    userposition: this.user._userposition,
    band: ''
  };

  public messageString: string;
  public noAccessString: string;
  public companyisDisabled: boolean=true;
  public profileisDisabled: boolean=true;
  public segmentsection: boolean=true;
  public companysection: boolean=true;
  public type:any;
  public uAvatarLetter: string;
  public passwordType: string = 'password';
  public passwordIconEye: string = 'md-eye';
  public eyeShow: boolean = true;
  public confirmpasswordType: string = 'password';
  public confirmpasswordIconEye: string = 'md-eye';
  public confirmeyeShow: boolean = true;
  public btnAccessProf: any;
  public btnAccessComp: any;
  public FormProfile: FormGroup;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, 
    public navParams: NavParams,
    private modal: ModalController,
    public loadingCtrl: LoadingController, 
    private fb: FormBuilder,
    public elementRef: ElementRef) {

    this.btnAccessProf = this.user.validateUserPermissions("User Profile");
    this.btnAccessComp = this.user.validateUserPermissions("User Company");
		if(this.btnAccessProf == "NoAccess" && this.btnAccessComp == "NoAccess")
      this.navCtrl.setRoot('ErrorUnauthorizedPage');
    if(this.btnAccessProf == "NoAccess")
      this.type = "company";
    else
      this.type = "profile";
    this.translateService.get(['NO_PERMISSION_MESSAGE']).subscribe((value) => {
      this.noAccessString = value.NO_PERMISSION_MESSAGE;                
    })
        
    let strUserFirstName = this.user._userfirstname
    strUserFirstName = strUserFirstName.charAt(0).toUpperCase() 
    let strUserLastName = this.user._userlastname
    strUserLastName = strUserLastName.charAt(0).toUpperCase() 
    this.uAvatarLetter =  strUserFirstName + strUserLastName;
  }

  ngOnInit() {
    //pwd strong: let regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,32}$/;
    let regexPwd = /^[A-Za-z\d$$@!%*?&]{6,32}$/; 
    this.FormProfile = this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      userposition: [],
      mobile: [],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.required,
        Validators.pattern(regexPwd)])],
      confirmpassword: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.required
      ])]
    },{
      validator: this.PasswordMatch('password', 'confirmpassword')
    });

    this.FormProfile.get('firstname').setValue(this.user._userfirstname);
    this.FormProfile.get('lastname').setValue(this.user._userlastname);
    this.FormProfile.get('userposition').setValue(this.user._userposition);
    this.FormProfile.get('mobile').setValue(this.user._usermobile);
    this.FormProfile.get('email').setValue(this.user._useremail);
    this.FormProfile.get('password').setValue(this.user._userpass);
    this.FormProfile.get('confirmpassword').setValue(this.user._userpass);
    
    
  }

  PasswordMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      //console.log(formGroup)  
      const control = formGroup.controls[controlName];
      //console.log(control)
        const matchingControl = formGroup.controls[matchingControlName];
        //console.log(matchingControl)
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {            
            return;
        }        
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
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
    if(this.type == 'profile'){
      this.profileisDisabled = this.profileisDisabled ? false : true;
      this.passwordType = 'password';
      this.confirmpasswordType = 'password';
      this.passwordIconEye = 'md-eye';
      this.confirmpasswordIconEye = 'md-eye'
      
      /*
      this.FormProfile.controls['password'].setValue('');
      this.FormProfile.controls['password'].markAsTouched();
      this.FormProfile.controls['confirmpassword'].setValue('');
      this.FormProfile.controls['confirmpassword'].markAsTouched();
      */
      //this.FormProfile.get('password').setValue(this.user._userpass);
      //this.FormProfile.get('confirmpassword').setValue(this.user._userpass);
      this.FormProfile.controls['password'].setValue(this.user._userpass);
      this.FormProfile.controls['confirmpassword'].setValue(this.user._userpass);

      //this.FormProfile.controls['password'].markAsTouched();
      //this.FormProfile.controls['confirmpassword'].markAsTouched();

      
    }else{
      this.companyisDisabled = this.companyisDisabled ? false : true;
    }

    if(this.profileisDisabled == false || this.companyisDisabled == false)
    {
      this.segmentsection = false;
       if(this.type == 'profile'){
        document.getElementById("profileform").className = document.getElementById("profileform").className.replace( /(?:^|\s)profile-padding(?!\S)/g , 'profile-edit-padding' )
      }
      else{
        document.getElementById("companyform").className = document.getElementById("companyform").className.replace( /(?:^|\s)profile-padding(?!\S)/g , 'profile-edit-padding' )
      }
      document.getElementById("contentform").className = document.getElementById("contentform").className.replace( /(?:^|\s)bknoform(?!\S)/g , 'bkform' )
    }else{
        this.segmentsection = true;
       if(this.type == 'profile'){
        document.getElementById("profileform").className = document.getElementById("profileform").className.replace( /(?:^|\s)profile-edit-padding(?!\S)/g , 'profile-padding' )
      }
      else{
        document.getElementById("companyform").className = document.getElementById("companyform").className.replace( /(?:^|\s)profile-edit-padding(?!\S)/g , 'profile-padding' )
      }
      document.getElementById("contentform").className = document.getElementById("contentform").className.replace( /(?:^|\s)bkform(?!\S)/g , 'bknoform' )     
    }
  }

  segmentChanged(ev: any) {
    this.profileisDisabled = true; 
    this.companyisDisabled = true;
   
    this.account.companyname = this.user._companyname,
    this.account.address = this.user._useraddress,
    this.account.city = this.user._usercity,
    this.account.stateorprovince = this.user._userstateorprovince,
    this.account.zipcode = this.user._userzipcode,
    this.account.country = this.user._usercountry, 
    this.account.webpage = this.user._userwebpage,
    this.account.phonenumber = this.user._userphonenumber,
    this.account.firstname = this.user._userfirstname,
    this.account.lastname = this.user._userlastname,
    this.account.mobile = this.user._usermobile,
    this.account.email = this.user._useremail,
    this.account.password = this.user._userpass,
    this.account.userposition = this.user._userposition
  }

  doSave(band){

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

      this.account.firstname = this.FormProfile.get('firstname').value;
      this.account.lastname = this.FormProfile.get('lastname').value;
      this.account.userposition = this.FormProfile.get('userposition').value;
      this.account.mobile = this.FormProfile.get('mobile').value;
      this.account.email = this.FormProfile.get('email').value;
      this.account.password = this.FormProfile.get('password').value;
      this.account.confirmpassword = this.FormProfile.get('confirmpassword').value;


      this.account.band = band;
      let dataRequired = true;

      if(band== 'profile')
      {
        let pass = this.account.password;
        let confpass = this.account.confirmpassword;
        
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
      }else{
        if(this.account.companyname == "")
        {
          dataRequired = false;
          this.translateService.get(['COMPANY_NAME_REQUIRED']).subscribe((value) => {
               this.messageString = value.COMPANY_NAME_REQUIRED;                
          })
        } 
      }

      if(dataRequired)
      {
        this.confirmSave(loading)
      }else{
        this.loadingControl('dismiss', loading) 
        this.doToast(this.messageString, 'top');
      } 

    });
  }

  async confirmSave(loading: any){
    try {
      await this.user.editInfo(this.account,true);
      this.loadingControl('dismiss', loading);
        this.profileisDisabled = true;
        this.segmentsection = true; 
        if(document.getElementById("profileform"))
          document.getElementById("profileform").className = document.getElementById("profileform").className.replace( /(?:^|\s)profile-edit-padding(?!\S)/g , 'profile-padding' );
        if(document.getElementById("companyform"))
        {
          this.companyisDisabled = true;
          document.getElementById("companyform").className = document.getElementById("companyform").className.replace( /(?:^|\s)profile-edit-padding(?!\S)/g , 'profile-padding' );       
        }
        document.getElementById("contentform").className = document.getElementById("contentform").className.replace( /(?:^|\s)bkform(?!\S)/g , 'bknoform' );

        this.pageTop.scrollToTop();

        if(this.type == 'profile'){          
          this.passwordType = 'password';
          this.confirmpasswordType = 'password';
          this.passwordIconEye = 'md-eye';
          this.confirmpasswordIconEye = 'md-eye';
        }
    } catch (error) {
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.messageString = value.CONNECTION_ERROR;                
      });
     this.loadingControl('dismiss', loading) 
     this.doToast(this.messageString, 'top'); 
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

  doToast(str, position){
    let toast = this.toastCtrl.create({
          message: str,
          duration: 3000,
          position: position
        });
        toast.present();
  } 
}
