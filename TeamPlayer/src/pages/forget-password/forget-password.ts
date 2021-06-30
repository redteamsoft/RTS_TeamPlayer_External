import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, ViewController, LoadingController, ModalController, Modal, ModalOptions } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
//import { Md5 } from 'ts-md5/dist/md5';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html'
})
export class ForgetPasswordPage {

  account: { companyid: string, userid: string, userposition: string, companyname: string, address: string, city: string, stateorprovince: string, zipcode: string, country: string, webpage: string, phonenumber: string, firstname: string, lastname: string, mobile: string, email: string, password: string, confirmpassword: string, band: string } = {
    companyname: "",
    address: "",
    city: "",
    stateorprovince: "",
    zipcode: "",
    country: "",
    webpage: "",
    phonenumber: "",
    firstname: "",
    lastname: "",
    mobile: "",
    email: this.navParams.get('email'),
    password: "",
    confirmpassword: "",
    companyid: "0",
    userid: this.navParams.get('userid'),
    userposition: "",
    band: 'forgetpass'
  };

  public resetForm: FormGroup;

  public messageString: string;
  public loginErrorString: string;
  public isDisabled: boolean = true;
  public companysection: boolean = true;
  public passwordType: string = 'password';
  public passwordIconEye: string = 'md-eye';
  public eyeShow: boolean = false;
  public confirmpasswordType: string = 'password';
  public confirmpasswordIconEye: string = 'md-eye';
  public confirmeyeShow: boolean = false;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public navParams: NavParams,
    private modal: ModalController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    private fb: FormBuilder) {
    let EntityAccepted = this.navParams.get('EntityAccepted')
    if (EntityAccepted != "1") {
      this.isDisabled = false;
    }
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);

  }

  ngOnInit() {
    //regex pwd strong:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,32}$/;
    let regexPwd = /^[A-Za-z\d$$@!%*?&]{6,32}$/; 
    
    this.resetForm = this.fb.group({
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
    //console.log(value)
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

  doConfirm() {
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
      let pass = this.resetForm.get('password').value;
      let confpass = this.resetForm.get('confirmpassword').value;
      let gotoMainPage = true;

      if (pass == "") {
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

      if (gotoMainPage) {
        this.account.password = this.resetForm.get('password').value;
        this.account.confirmpassword = this.resetForm.get('confirmpassword').value;
        this.gotoMainPage(loading)
      } else {
        this.loadingControl('dismiss', loading)
        this.doToast(this.messageString);
      }
    });
  }

  async gotoMainPage(loading: any){
    try {
      await this.user.editInfo(this.account,false);
      this.loadingControl('dismiss', loading);
      this.doControlLogin(this.account.userid);
    } catch (error) {
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.messageString = value.CONNECTION_ERROR;                
     });
     this.doToast(this.messageString);
     this.loadingControl('dismiss', loading);
    }
  }

  doControlLogin(UserID) {
    this.user.controlLogin(UserID).subscribe((resp) => {
      this.navCtrl.setRoot(MainPage);
    }, (err) => {
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.loginErrorString = value.CONNECTION_ERROR;
      })
      this.doToast(this.loginErrorString);
    });
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
