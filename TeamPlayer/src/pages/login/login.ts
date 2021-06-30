import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController, Platform } from 'ionic-angular';

import { User, Constant } from '../../providers';
import { MainPage } from '../';
import { LoginProfilePage } from '../';
import { Intercom } from '@ionic-native/intercom';
//import { Md5 } from 'ts-md5/dist/md5';

@IonicPage({ segment: 'login' })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public signup: boolean = false;
  public resend: boolean = false;
  public txtpass: boolean = false;
  public forgetpass: boolean = false;
  public _forgetpass: boolean = false;
  public txtcode: boolean = false;
  public email: boolean = true;
  public thanksSection: boolean = false;
  public txtemail: boolean = true;
  public login: boolean = false;
  public isDisabled: boolean = false;
  public spinner: boolean = false;
  public lblemail: boolean = false;

  public passwordType: string = 'password';
  public passwordIconEye: string = 'md-eye';
  public eyeShow: boolean = false;

  account: { email: string, password: string, code: string } = {
    email: '',
    password: '',
    code: ''
  };

  public loginErrorString: string;
  public Logintittle: string;
  public ThanksDesc: string;
  public AuthorizationCode: string;
  public LoginUserID: string;
  public EntityAccepted: string;
  public FirstLogin: number;
  public upass: string;


  constructor(public menu: MenuController, public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public platform: Platform,
    public constant: Constant,
    private intercom: Intercom) {

    this._forgetpass = false;    
  }

  ngOnInit() {    
    if ((this.platform.is('core') || this.platform.is('mobileweb')) && !this.constant.localMode) {      
      if(localStorage.getItem("access_token")){
        let openupgrd;
        openupgrd = this.constant.urlTPWeb + '/#/home';
        window.open(openupgrd, "_self", "location=yes");
      }
    }
      
  }

  togglePassword() {
    this.passwordType = this.passwordType == 'password' ? 'text' : 'password';
    this.passwordIconEye = this.passwordIconEye == 'md-eye' ? 'md-eye-off' : 'md-eye';
  }

  showeyeicon(value) {
    this.eyeShow = (value.length > 0) ? true : false;
    if (value.length < 1) {
      this.passwordType = 'password';
      this.passwordIconEye = 'md-eye'
    }
  }

  lblcolorchange() {
    var inputValue = (<HTMLInputElement>document.getElementById("txtemail")).value;

    if (inputValue == "") {
      document.getElementById("txtemail").className = document.getElementById("txtemail").className.replace(/(?:^|\s)txtemail(?!\S)/g, 'txtemailph')
    } else {
      document.getElementById("txtemail").className = document.getElementById("txtemail").className.replace(/(?:^|\s)txtemailph(?!\S)/g, 'txtemail')
    }
  }

  doContinue(step) {
    this.spinner = true;
    if (step == 1) {
      this.user.verifyEmail(this.account.email).subscribe((resp) => {
        this.EntityAccepted = resp[0].EntityAccepted;
        this.FirstLogin = resp[0].FirstLogin;
        this.upass = resp[0].upass;
        if (resp[0].EmailExist == 1) {

          this.txtemail = false;
          this.lblemail = true;
          /* let element = document.getElementById('txtemail')         
      
           element.setAttribute("style", "background: rgba(255, 255, 255, 0);font-size: 18px;");*/

          if (resp[0].InvitationStatus == 'Invited') {
            this.LoginUserID = resp[0].UserID
            this.doGetAuthorizationCode('')
            this.translateService.get(['LOGIN_TITLE_CODE']).subscribe((value) => {
              this.Logintittle = value.LOGIN_TITLE_CODE;
            })
            this.txtcode = true;
            this.resend = true;
            this.email = false;
            this.isDisabled = true;
            this.spinner = false;
          } else if (resp[0].InvitationStatus == 'Accepted') {
            if (this.upass == "false") {
              this.LoginUserID = resp[0].UserID
              this.doGetAuthorizationCode('')
              this.translateService.get(['LOGIN_TITLE_CODE']).subscribe((value) => {
                this.Logintittle = value.LOGIN_TITLE_CODE;
              })
              this.txtcode = true;
              this.resend = true;
              this.email = false;
              this.isDisabled = true;
              this.spinner = false;
            } else {
              this.translateService.get(['LOGIN_TITLE_PASS']).subscribe((value) => {
                this.Logintittle = value.LOGIN_TITLE_PASS;
              })
              this.LoginUserID = resp[0].UserID
              this.txtpass = true;
              this.forgetpass = true;
              this.login = true;
              this.email = false;
              this.isDisabled = true;
              this.spinner = false;
            }
          }
        } else {
          this.spinner = false;
          this.translateService.get(['LOGIN_EMAIL_ERROR']).subscribe((value) => {
            this.loginErrorString = value.LOGIN_EMAIL_ERROR;
          })
          this.doToast(this.loginErrorString);
        }
      }, (err) => {
        this.spinner = false;
        this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
          this.loginErrorString = value.CONNECTION_ERROR;
        })
        this.doToast(this.loginErrorString);
      });
    } else if (step == 2) {

      this.user.authorizationCode(this.LoginUserID, 'compare', (this.account.code).toLowerCase()).subscribe((resp) => {
        this.AuthorizationCode = resp[0].codestatus;

        if (this.AuthorizationCode == "true") {
          this.user.userAccepted(this.LoginUserID).subscribe((resp) => {
            if (this._forgetpass) {
              let params = {
                userid: this.LoginUserID,
                email: this.account.email
              }
              this.navCtrl.push('ForgetPasswordPage', params);
            } else {
              this.thanksSection = true;
              this.translateService.get(['LOGIN_THANKS_DESC']).subscribe((value) => {
                this.ThanksDesc = value.LOGIN_THANKS_DESC;
              })
              this.translateService.get(['LOGIN_TITLE_THANKS']).subscribe((value) => {
                this.Logintittle = value.LOGIN_TITLE_THANKS;
              })
              this.txtpass = false;
              this.txtcode = false;
              this.resend = false;
              this.email = false;
              this.spinner = false;
              this.lblemail = false;
            }
          }, (err) => {
            this.spinner = false;
            this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
              this.loginErrorString = value.CONNECTION_ERROR;
            })
            this.doToast(this.loginErrorString);
          });
        } else {
          this.spinner = false;
          this.translateService.get(['LOGIN_AUTHCODE_ERROR']).subscribe((value) => {
            this.loginErrorString = value.LOGIN_AUTHCODE_ERROR;
          })
          this.doToast(this.loginErrorString);
        }
      }, (err) => {
        this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
          this.loginErrorString = value.CONNECTION_ERROR;
        })
        this.doToast(this.loginErrorString);
      });
    } else if (step == 3) {
      this.doControlLogin(this.LoginUserID);
    } else if (step == 4) {
      this.user.loginValidate(this.account).subscribe((resp) => {
        if (resp[0].Logged == 1) {
          this.doControlLogin(resp[0].UserID);
        } else {
          this.spinner = false;
          this.translateService.get(['LOGIN_ERROR']).subscribe((value) => {
            this.loginErrorString = value.LOGIN_ERROR;
          })
          this.doToast(this.loginErrorString);
        }
      }, (err) => {
        this.spinner = false;
        this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
          this.loginErrorString = value.CONNECTION_ERROR;
        })
        this.doToast(this.loginErrorString);
      });
    }
  }

  doControlLogin(UserID) {
    this.user.controlLogin(UserID).subscribe((resp) => {
      this.spinner = false;
      //console.log(this.platform.is('core'))
      //console.log(this.platform.is('mobileweb'))
      //console.log(this.platform.is('android'))
      
      window.localStorage.setItem('CurrentUserBusinessProduct', resp[0].BusinessProduct);
      this.user.UserPermissions(UserID).subscribe((dataPermissions) => {

        window.localStorage.setItem('tp_userpermissions', btoa(JSON.stringify(dataPermissions)));
        if (this.FirstLogin == 0 && this.upass == "true") {
          if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
            this.navCtrl.setRoot(MainPage);
          } else {
            if (!this.constant.localMode) {
              let openupgrd;
              localStorage.setItem('tp_access_token', resp[0].AccessToken);
              sessionStorage.setItem('tp_access_token', resp[0].AccessToken);
              sessionStorage.setItem('tp_session', resp[0].LoginID);
              sessionStorage.setItem('tp_userid', UserID);
              sessionStorage.setItem('tp_userpermissions', btoa(JSON.stringify(dataPermissions)));
  
              openupgrd = this.constant.urlTPWeb + '/#/login?p=';
              //console.log(this.account.password)
              //console.log(encodeURIComponent(this.account.password))
              let filePath: string = 'usu=' + this.account.email + '&pass=' + encodeURIComponent(this.account.password) + '&loginid=' + resp[0].LoginID + '&from=login';
              let base64Str: string = window.btoa(filePath);

              //INTERCOM Registration
              this.intercom.registerIdentifiedUser({email: this.account.email, userId: UserID})

              //console.log(base64Str)
              window.open(encodeURI(openupgrd + base64Str), "_self", "location=yes"); // Go Teamplayer Site
              //window.open('https://teamplayer.redteamsoftware.net/#/login?p=', '_self')
            } else {
              localStorage.setItem('tp_access_token', resp[0].AccessToken);
              sessionStorage.setItem('tp_access_token', resp[0].AccessToken);
              sessionStorage.setItem('tp_session', resp[0].LoginID);
              sessionStorage.setItem('tp_userid', UserID);
              sessionStorage.setItem('tp_userpermissions', btoa(JSON.stringify(dataPermissions)));

              //INTERCOM Registration
              this.intercom.registerIdentifiedUser({email: this.account.email, userId: UserID})

              this.navCtrl.setRoot(MainPage);
            }
          }
        } else {
          let params = {
            EntityAccepted: this.EntityAccepted,
            LoginID: resp[0].LoginID
          }
  
          if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
            
          } else {
            localStorage.setItem('tp_access_token', resp[0].AccessToken);
            sessionStorage.setItem('tp_access_token', resp[0].AccessToken);
            sessionStorage.setItem('tp_session', resp[0].LoginID);
            sessionStorage.setItem('tp_userid', UserID);         
          }
  
          // this.user.logout();   
          this.navCtrl.push(LoginProfilePage, params);
  
        }
      });
      
    }, (err) => {
      this.spinner = false;
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.loginErrorString = value.CONNECTION_ERROR;
      })
      this.doToast(this.loginErrorString);
    });
  }

  doGetAuthorizationCode(band) {
    if (band == 'forgetpass') {
      this.translateService.get(['LOGIN_TITLE_CODE']).subscribe((value) => {
        this.Logintittle = value.LOGIN_TITLE_CODE;
      })
      this.txtcode = true;
      this.resend = true;
      this.email = false;
      this.isDisabled = true;
      this.spinner = false;
      this.login = false;
      this.txtpass = false;
      this.forgetpass = false;
      this._forgetpass = true;
    }
    this.user.authorizationCode(this.LoginUserID, 'get', '').subscribe((resp) => {
      //this.AuthorizationCode = resp[0].codestatus;
    }, (err) => {
      this.translateService.get(['CONNECTION_ERROR']).subscribe((value) => {
        this.loginErrorString = value.CONNECTION_ERROR;
      })
      this.doToast(this.loginErrorString);
    });
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
