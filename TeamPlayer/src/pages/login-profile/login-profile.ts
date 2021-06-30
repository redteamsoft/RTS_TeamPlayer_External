import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, ViewController, LoadingController, ModalController, Modal, ModalOptions, Platform } from 'ionic-angular';

import { User, Constant } from '../../providers';
import { MainPage } from '../';
//import { Md5 } from 'ts-md5/dist/md5';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login-profile',
  templateUrl: 'login-profile.html'
})
export class LoginProfilePage {
  account: {
    companyid: string,
    userid: string,
    userposition: string,
    companyname: string,
    address: string,
    city: string,
    stateorprovince: string,
    zipcode: string,
    country: string,
    webpage: string,
    phonenumber: string,
    firstname: string,
    lastname: string,
    mobile: string,
    email: string,
    password: string,
    confirmpassword: string,
    band: string,
    preferencebilling: string
  } = {
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
      band: 'login',
      preferencebilling: this.user._preferencebilling
    };

  public messageString: string;
  public isDisabled: boolean = true;
  public passwordType: string = 'password';
  public passwordIconEye: string = 'md-eye';
  public eyeShow: boolean = true;
  public confirmpasswordType: string = 'password';
  public confirmpasswordIconEye: string = 'md-eye';
  public confirmeyeShow: boolean = true;
  public LoginID: string;
  public profileForm: FormGroup;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public navParams: NavParams,
    private modal: ModalController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public platform: Platform,
    public constant: Constant,
    private fb: FormBuilder) {
    this.LoginID = this.navParams.get('LoginID')
    let EntityAccepted = this.navParams.get('EntityAccepted')
    if (EntityAccepted != "1") {
      this.isDisabled = false;
    }
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  ngOnInit() {
    //pwd strong: let regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,32}$/;
    let regexPwd = /^[A-Za-z\d$$@!%*?&]{6,32}$/; 
    this.profileForm = this.fb.group({
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
      ])],
      companyname: ['', Validators.compose([Validators.required])],
      address: [],
      city: [],
      stateorprovince: [],
      zipcode: [],
      country: [],
      webpage: [],
      phonenumber: []
    },{
      validator: this.PasswordMatch('password', 'confirmpassword')
    });

    this.profileForm.get('firstname').setValue(this.user._userfirstname);
    this.profileForm.get('lastname').setValue(this.user._userlastname);
    this.profileForm.get('userposition').setValue(this.user._userposition);
    this.profileForm.get('mobile').setValue(this.user._usermobile);
    this.profileForm.get('email').setValue(this.user._useremail);
    this.profileForm.get('companyname').setValue(this.user._companyname);
    this.profileForm.get('address').setValue(this.user._useraddress);
    this.profileForm.get('city').setValue(this.user._usercity);
    this.profileForm.get('stateorprovince').setValue(this.user._userstateorprovince);
    this.profileForm.get('zipcode').setValue(this.user._userzipcode);
    this.profileForm.get('country').setValue(this.user._usercountry);
    this.profileForm.get('webpage').setValue(this.user._userwebpage);
    this.profileForm.get('phonenumber').setValue(this.user._userphonenumber);
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;
      let isValid = control.root.value[field_name] == input;
      if (!isValid)
        return { 'equalTo': { isValid } };
      else
        return null;
    };
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

  togglePassword(num) {
    if (num == 1) {
      this.passwordType = this.passwordType == 'password' ? 'text' : 'password';
      this.passwordIconEye = this.passwordIconEye == 'md-eye' ? 'md-eye-off' : 'md-eye';
    } else {
      this.confirmpasswordType = this.confirmpasswordType == 'password' ? 'text' : 'password';
      this.confirmpasswordIconEye = this.confirmpasswordIconEye == 'md-eye' ? 'md-eye-off' : 'md-eye';
    }
  }

  showeyeicon(value, num) {
    if (num == 1) {
      this.eyeShow = (value.length > 0) ? true : false;
      if (value.length < 1) {
        this.passwordType = 'password';
        this.passwordIconEye = 'md-eye'
      }
    } else {
      this.confirmeyeShow = (value.length > 0) ? true : false;
      if (value.length < 1) {
        this.confirmpasswordType = 'password';
        this.confirmpasswordIconEye = 'md-eye'
      }
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

  doSave() {
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
      this.loadingControl('start', loading);

      this.account.firstname = this.profileForm.get('firstname').value;
      this.account.lastname = this.profileForm.get('lastname').value;
      this.account.userposition = this.profileForm.get('userposition').value;
      this.account.mobile = this.profileForm.get('mobile').value;
      this.account.email = this.profileForm.get('email').value;
      this.account.password = this.profileForm.get('password').value;
      this.account.confirmpassword = this.profileForm.get('confirmpassword').value;
      this.account.companyname = this.profileForm.get('companyname').value;
      this.account.address = this.profileForm.get('address').value;
      this.account.city = this.profileForm.get('city').value;
      this.account.stateorprovince = this.profileForm.get('stateorprovince').value;
      this.account.zipcode = this.profileForm.get('zipcode').value;
      this.account.country = this.profileForm.get('country').value;
      this.account.webpage = this.profileForm.get('webpage').value;
      this.account.phonenumber = this.profileForm.get('phonenumber').value;

      let pass = this.account.password;
      let confpass = this.account.confirmpassword;
      let gotoMainPage = true;

      if (this.account.firstname == "") {
        gotoMainPage = false;
        this.translateService.get(['FIRST_NAME_REQUIRED']).subscribe((value) => {
          this.messageString = value.FIRST_NAME_REQUIRED;
        })
      }
      else if (this.account.lastname == "") {
        gotoMainPage = false;
        this.translateService.get(['LAST_NAME_REQUIRED']).subscribe((value) => {
          this.messageString = value.LAST_NAME_REQUIRED;
        })
      }
      else if (this.account.email == "") {
        gotoMainPage = false;
        this.translateService.get(['EMAIL_REQUIRED']).subscribe((value) => {
          this.messageString = value.EMAIL_REQUIRED;
        })
      }
      else if (pass == "") {
        gotoMainPage = false;
        this.translateService.get(['PASSWORD_REQUIRED']).subscribe((value) => {
          this.messageString = value.PASSWORD_REQUIRED;
        })
      }
      else if ((pass != confpass) || (pass.trim() == "" && confpass.trim() == "")) {
        gotoMainPage = false;
        this.translateService.get(['WRONG_CONFIRM_PASSWORD']).subscribe((value) => {
          this.messageString = value.WRONG_CONFIRM_PASSWORD;
        })
      }
      else if (this.account.companyname == "") {
        gotoMainPage = false;
        this.translateService.get(['COMPANY_NAME_REQUIRED']).subscribe((value) => {
          this.messageString = value.COMPANY_NAME_REQUIRED;
        })
      }

      if (gotoMainPage) {
        this.gotoMainPage(loading)
      } else {
        this.loadingControl('dismiss', loading)
        this.doToast(this.messageString);
      }
    });
  }

  async gotoMainPage(loading: any) {
    try {
      await this.user.editInfo(this.account, true);
      //console.log('saving user qa');
      this.loadingControl('dismiss', loading)
      if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
        this.navCtrl.setRoot(MainPage);
      } else {
        if (!this.constant.localMode) {
          let openupgrd: any;
          openupgrd = this.constant.urlTPWeb + '/#/login?p=';
          let filePath: string = 'usu=' + this.account.email + '&pass=' + encodeURIComponent(this.account.password) + '&loginid=' + this.LoginID + '&from=login';
          let base64Str: string = window.btoa(filePath);

          window.open(encodeURI(openupgrd + base64Str), "_self", "location=yes"); // Go Teamplayer Site
        } else {
          this.navCtrl.setRoot(MainPage);
        }
      }
    } catch (error) {
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.messageString = value.CONNECTION_ERROR;
      })
      this.doToast(this.messageString);
      this.loadingControl('dismiss', loading);
    }
  }

  loadingControl(band = '', loading) {
    if (band === 'start') {
      loading.present();
    } else {
      loading.dismiss();
    }
  }

  doToast(str) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
