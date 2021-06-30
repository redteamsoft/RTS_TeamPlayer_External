import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Deeplinks } from '@ionic-native/deeplinks';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, ToastController } from 'ionic-angular';
import { FirstRunPage, MainPage } from '../pages';
import { Settings, User, Customer, Project, Transaction, Constant } from '../providers';
import { Intercom } from '@ionic-native/intercom';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
}

@Component({
  template: `<ion-split-pane when="5000">
                <ion-menu [content]="content">
                  <ion-header>
                    <ion-toolbar>
                      <div class="rt-margin-0" style="width: 100% !important;">                  
                        <div  class="item itembkgray rt-margin-0 itembkgray"  style="height: 130px; background-color:#ffffff !important; border-width: 0px !important; padding-left: 8px !important;padding-right: 16px !important">                    
                          <div menuClose class="col" style="margin-top: 12px;white-space: nowrap;overflow: hidden;" (click)="checkProfilePermissions()">
                            <img *ngIf="!letters" style=" left: 0px !important; top: 7px;max-width: 66px;max-height: 66px; width: 100%; height: 100%; border-radius: 50%;"  >
                            <button *ngIf="letters"  class="orange-circle-background">
                              <span id="userletters" class="avatarletters">{{uAvatarLetter}}</span>
                            </button>
                            <p style="color:#3F4965;margin-top: 12px;">{{UserName}}</p>
                            <p style="margin-top: -10px;color:#3F4965;font-weight: 300;text-overflow: ellipsis;overflow: hidden;margin-right: -10px;">{{CompanyName}}</p>
                            <!--p style="font-weight: 300;margin-bottom: -12px;margin-top: -5px;"><a id="weblink">EntityName</a></p-->
                          </div> 
                          <button *ngIf="devlogout" class="menu-sign-out" (click)="logout()">
                            {{ 'SIGN_OUT' | translate }}
                          </button>
                        </div>  
                      </div>
                    </ion-toolbar>
                  </ion-header>

                  <ion-content style="background-color: #3F4965;">
                    <ion-list>
                      <ion-list-header style="background-color: #3F4965;color: white;border-top: 0px;">
                        {{ 'NAVIGATE' | translate }}
                      </ion-list-header>
                      <button menuClose ion-item (click)="openPage('ListCustomerPage')" style="background-color: #3F4965;color: white;">
                        <ion-icon item-start [name]="'ios-briefcase'" [color]="isActive('ListCustomerPage')"></ion-icon>
                          {{ 'CUSTOMER_TITLE' | translate }}
                      </button>                      
                    </ion-list>

                    <ion-list>
                      <ion-list-header style="background-color: #3F4965;color: white;border-top: 0px;"> 
                        {{ 'ACCOUNT' | translate }}
                      </ion-list-header>
                      <button *ngIf="!isIOS" menuClose ion-item (click)="openPage('AccountDetailPage')" style="background-color: #3F4965;color: white;">
                        <ion-icon item-start [name]="'md-information-circle'" [color]="isActive('AccountDetailsPage')"></ion-icon>
                          {{ 'ACCOUNT_DETAILS' | translate }}
                      </button>
                      <button menuClose ion-item (click)="openPage('SettingsPage')" style="background-color: #3F4965;color: white;">
                        <ion-icon item-start [name]="'cog'" [color]="isActive('SettingsPage')"></ion-icon>
                          {{ 'SETTINGS' | translate }}
                      </button>                     
                    </ion-list>

                  </ion-content>
                  <div style="position: absolute;bottom: 10px;right: 10px;display: -webkit-inline-box;">
                     <img src="assets/imgs/teamplayer_silver_logo.png" alt="attachment" style="width: 130px;">
                     <div style="color: #C5C5C5;padding: 3px 10px 0px 15px;font-size: 17px;font-weight: lighter;">v {{versionCode}}</div>
                  </div>

                </ion-menu>
                <ion-nav #content [root]="rootPage" main></ion-nav>
            </ion-split-pane>`
})
export class MyApp {

  //rootPage = FirstRunPage;
  @ViewChild(Nav) navChild:Nav;
  public rootPage;

  public UserName: string;
  public CompanyName: string;
  public UserFirstName: string;
  public UserLastName: string;
  public strUserFirstName: string;
  public strUserLastName: string;
  public uAvatarLetter: string;
  public letters: boolean = true;
  public devlogout: boolean = true;
  public versionCode: string;
  public isIOS: boolean;
  public btnAccessProf: any;
  public btnAccessComp: any;
  public noAccessString: string;

  @ViewChild(Nav) nav: Nav;

  constructor(public project: Project,
    public customer: Customer,
    public user: User,
    public transaction: Transaction,
    public constant: Constant,
    public menu: MenuController,
    public translate: TranslateService,
    public platform: Platform,
    settings: Settings,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public toastCtrl: ToastController,    
    public deeplinks: Deeplinks,
    private intercom: Intercom,
    ) {
    platform.ready().then(() => {      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.presentPrompt()
      translate.use('es');
      translate.use('en');

      setTimeout(() => {
        settings.getValue("language").then(() => {
          let checkLanguage = settings.getValue("language")
          // console.log(checkLanguage)
          checkLanguage.then(data => {
            if (data == 1) {
              translate.use('en');
            } else if (data == 2) {
              translate.use('es');
            } else {
              translate.use('en');
            }
          });
        }).catch((e) => translate.use('en'))
      }, 1000);

      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        this.user.ValidateToken().subscribe((resp) => {
          if (resp[0].Sessions == 0) {
            //console.log("Token invalid");
            this.rootPage = FirstRunPage;
          } else {
            //console.log(resp[0].Sessions)
          }
        }, (err) => {
          this.rootPage = FirstRunPage;
        });
      }            

      this.deeplinks.route({
        '/about-us': MainPage,        
        '/transaction/:redirectSource/:redirectID': MainPage,
      }).subscribe((match) => {        
        //console.log('Successfully matched route', match);
        if(match.$args.redirectSource && match.$args.redirectID){
          sessionStorage.setItem("redirectSource", match.$args.redirectSource);
          sessionStorage.setItem("redirectID", match.$args.redirectID);
          if(this.user._userid)
            this.navChild.setRoot(MainPage);
        }
      },
      (nomatch) => {        
        //console.error('Got a deeplink that didn\'t match', nomatch);
      });

      // local store for user
      this.user._userid = window.localStorage.getItem('userid') ? window.localStorage.getItem('userid') : '';
      this.user._userfirstname = window.localStorage.getItem('userfirstname') ? window.localStorage.getItem('userfirstname') : '';
      this.user._userlastname = window.localStorage.getItem('userlastname') ? window.localStorage.getItem('userlastname') : '';
      this.user._companyname = window.localStorage.getItem('companyname') ? window.localStorage.getItem('companyname') : '';
      this.user._nulluserpass = window.localStorage.getItem('nulluserpass') ? window.localStorage.getItem('nulluserpass') : '';
      this.user._refreshpage = window.localStorage.getItem('refreshpage') ? window.localStorage.getItem('refreshpage') : '';
      this.user._refreshprevpage = window.localStorage.getItem('refreshprevpage') ? window.localStorage.getItem('refreshprevpage') : '';
      this.user._userposition = window.localStorage.getItem('userposition') ? window.localStorage.getItem('userposition') : '';

      this.user._useraddress = window.localStorage.getItem('useraddress') ? window.localStorage.getItem('useraddress') : '';
      this.user._usercity = window.localStorage.getItem('usercity') ? window.localStorage.getItem('usercity') : '';
      this.user._usercompanyid = window.localStorage.getItem('usercompanyid') ? window.localStorage.getItem('usercompanyid') : '';
      this.user._usercountry = window.localStorage.getItem('usercountry') ? window.localStorage.getItem('usercountry') : '';
      this.user._useremail = window.localStorage.getItem('useremail') ? window.localStorage.getItem('useremail') : '';
      this.user._usermobile = window.localStorage.getItem('usermobile') ? window.localStorage.getItem('usermobile') : '';
      this.user._userphonenumber = window.localStorage.getItem('userphonenumber') ? window.localStorage.getItem('userphonenumber') : '';
      this.user._userstateorprovince = window.localStorage.getItem('userstateorprovince') ? window.localStorage.getItem('userstateorprovince') : '';
      this.user._userwebpage = window.localStorage.getItem('userwebpage') ? window.localStorage.getItem('userwebpage') : '';
      this.user._userzipcode = window.localStorage.getItem('userzipcode') ? window.localStorage.getItem('userzipcode') : '';
      this.user._userpass = window.localStorage.getItem('userpass') ? window.localStorage.getItem('userpass') : '';
      this.user._ContentDisabled = JSON.parse(window.localStorage.getItem('contentdisabled'));
      this.user._StatusRelationship = window.localStorage.getItem('statusrelationship') ? window.localStorage.getItem('statusrelationship') : 0;
      this.user._Product = window.localStorage.getItem('product') ? window.localStorage.getItem('product') : '';
      this.user._PremiumContent = JSON.parse(window.localStorage.getItem('premiumcontent'));
      this.user._ViewPremiumContent = JSON.parse(window.localStorage.getItem('viewpremiumcontent'));
      this.user._preferencebilling = window.localStorage.getItem('preferencebilling') ? window.localStorage.getItem('preferencebilling') : '';

      // local store for project 
      this.project._projectid = window.localStorage.getItem('projectid') ? window.localStorage.getItem('projectid') : '';
      this.project._projectnumber = window.localStorage.getItem('projectnumber') ? window.localStorage.getItem('projectnumber') : '';
      this.project._projectname = window.localStorage.getItem('projectname') ? window.localStorage.getItem('projectname') : '';
      this.project._projectscope = window.localStorage.getItem('projectscope') ? window.localStorage.getItem('projectscope') : '';
      this.project._rtprojectid = window.localStorage.getItem('rtprojectid') ? window.localStorage.getItem('rtprojectid') : '';
      this.project._rtDateformat = window.localStorage.getItem('rtdateformat') ? window.localStorage.getItem('rtdateformat') : '';
      this.project._rtMonetarySymbol = window.localStorage.getItem('rtmonetarysymbol') ? window.localStorage.getItem('rtmonetarysymbol') : '';
      this.project._rtProjNum = window.localStorage.getItem('rtprojnum') ? window.localStorage.getItem('rtprojnum') : '';
      this.project._rtScopeNum = window.localStorage.getItem('rtscopenum') ? window.localStorage.getItem('rtscopenum') : '';

      // local store for customer
      this.customer._customerid = window.localStorage.getItem('customerid') ? window.localStorage.getItem('customerid') : '';
      this.customer._customername = window.localStorage.getItem('customername') ? window.localStorage.getItem('customername') : '';
      this.customer._address = window.localStorage.getItem('address') ? window.localStorage.getItem('address') : '';
      this.customer._city = window.localStorage.getItem('city') ? window.localStorage.getItem('city') : '';
      this.customer._stateorprovince = window.localStorage.getItem('stateorprovince') ? window.localStorage.getItem('stateorprovince') : '';
      this.customer._zipcode = window.localStorage.getItem('zipcode') ? window.localStorage.getItem('zipcode') : '';
      this.customer._phonenumber = window.localStorage.getItem('phonenumber') ? window.localStorage.getItem('phonenumber') : '';

      // local store for transaction
      this.transaction._transactionid = window.localStorage.getItem('transactionid') ? window.localStorage.getItem('transactionid') : '';
      this.transaction._transactiondetailid = window.localStorage.getItem('transactiondetailid') ? window.localStorage.getItem('transactiondetailid') : '';
      this.transaction._sourceid = window.localStorage.getItem('sourceid') ? window.localStorage.getItem('sourceid') : '';
      this.transaction._charsourceid = window.localStorage.getItem('charsourceid') ? window.localStorage.getItem('charsourceid') : '';
      this.transaction._transactiontype = window.localStorage.getItem('transactiontype') ? window.localStorage.getItem('transactiontype') : '';
      this.transaction._transactionnumber = window.localStorage.getItem('transactionnumber') ? window.localStorage.getItem('transactionnumber') : '';
      this.transaction._subject = window.localStorage.getItem('subject') ? window.localStorage.getItem('subject') : '';
      this.transaction._status = window.localStorage.getItem('status') ? window.localStorage.getItem('status') : '';
      this.transaction._transactionduedate = window.localStorage.getItem('transactionduedate') ? window.localStorage.getItem('transactionduedate') : '';
      this.transaction._submitteddate = window.localStorage.getItem('submitteddate') ? window.localStorage.getItem('submitteddate') : '';
      this.transaction._company = window.localStorage.getItem('company') ? window.localStorage.getItem('company') : '';
      this.transaction._dbname = window.localStorage.getItem('dbname') ? window.localStorage.getItem('dbname') : '';
      this.transaction._datesdif = window.localStorage.getItem('datesdif') ? window.localStorage.getItem('datesdif') : '';
      this.transaction._requester = window.localStorage.getItem('requester') ? window.localStorage.getItem('requester') : '';
      this.transaction._requesterposition = window.localStorage.getItem('requesterposition') ? window.localStorage.getItem('requesterposition') : '';
      this.transaction._amountsubmitted = window.localStorage.getItem('amountsubmitted') ? window.localStorage.getItem('amountsubmitted') : '';
      this.transaction._attachmentname = window.localStorage.getItem('attachmentname') ? window.localStorage.getItem('attachmentname') : '';
      this.transaction._paymenttermsname = window.localStorage.getItem('paymenttermsname') ? window.localStorage.getItem('paymenttermsname') : '';
      this.transaction._paymenttermsduedays = window.localStorage.getItem('paymenttermsduedays') ? window.localStorage.getItem('paymenttermsduedays') : '';
      this.transaction._requesteremail = window.localStorage.getItem('requesteremail') ? window.localStorage.getItem('requesteremail') : '';
      this.transaction._vatvenuevalue = window.localStorage.getItem('vatvenuevalue') ? window.localStorage.getItem('vatvenuevalue') : 0;
      this.transaction._taxvenuevalue = window.localStorage.getItem('taxvenuevalue') ? window.localStorage.getItem('taxvenuevalue') : 0;
      this.transaction._retainagevalue = window.localStorage.getItem('retainagevalue') ? window.localStorage.getItem('retainagevalue') : 0;
      this.transaction._notes = window.localStorage.getItem('notes') ? window.localStorage.getItem('notes') : '';
      this.transaction._footer = window.localStorage.getItem('footer') ? window.localStorage.getItem('footer') : '';
      this.transaction._olddata = window.localStorage.getItem('olddata') ? window.localStorage.getItem('olddata') : '';

      // local store for constants 
      this.constant.urlEnviroment = window.localStorage.getItem('urlEnviroment') ? window.localStorage.getItem('urlEnviroment') : '';
      this.constant.urlLink = window.localStorage.getItem('urlLink') ? window.localStorage.getItem('urlLink') : '';
      this.constant.versionCodeAndroid = window.localStorage.getItem('versionCodeAndroid') ? window.localStorage.getItem('versionCodeAndroid') : '';
      this.constant.versionCodeBrowser = window.localStorage.getItem('versionCodeBrowser') ? window.localStorage.getItem('versionCodeBrowser') : '';
      this.constant.versionCodeiOS = window.localStorage.getItem('versionCodeiOS') ? window.localStorage.getItem('versionCodeiOS') : '';
      this.constant.urlUploadRT = window.localStorage.getItem('urlUploadRT') ? window.localStorage.getItem('urlUploadRT') : '';

      var url = new URL(location.href);
      var param = url.searchParams.get("p");
      this.isIOS = platform.is('ios');
      if (platform.is('core') || param != null) {
        if (param != null) {
          this.user.controlLoginbridge(param).subscribe((resp) => {
            this.devlogout = false;
            this.rootPage = MainPage;
          }, (err) => {
            this.rootPage = FirstRunPage;
          });
        } else {
          if (this.user._userid != '') {
            this.rootPage = MainPage;
          } else {
            this.rootPage = FirstRunPage;
          }
        }
      } else {
        if (this.user._userid != '') {
          this.rootPage = MainPage;
        } else {
          this.rootPage = FirstRunPage;
        }
      }            

      this.menu.enable(false);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  isActive(page) {

    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.versionCode = this.constant.versionCodeBrowser;
    } else if (this.platform.is('android')) {
      this.versionCode = this.constant.versionCodeAndroid;
    } else if (this.platform.is('ios')) {
      this.versionCode = this.constant.versionCodeiOS;
    }
    // let childNav = this.nav.getActiveChildNavs()[0]; 

    if (this.user._userfirstname != this.UserFirstName) {
      this.UserName = this.user._userfirstname + ' ' + this.user._userlastname;
      this.CompanyName = this.user._companyname;

      /* if(UserImage != "") 
      {
        imageURL = "https://" + Company + "." + api.shortappUrl + "/Uploads/Users/" + UserImage
        vm.displayimage = "display:block";  
        vm.displaybg = "display:none";
        /*saveImage.downloadImage(imageURL, imageName)
            .then(function(localURL) {
                
          img = img.replace('actualURL', 'localURL');

        })  
      }else{     

        vm.displayimage = "display:none";*/

      let strUserFirstName = this.user._userfirstname
      strUserFirstName = strUserFirstName.charAt(0).toUpperCase()
      let strUserLastName = this.user._userlastname
      strUserLastName = strUserLastName.charAt(0).toUpperCase()
      this.uAvatarLetter = strUserFirstName + strUserLastName
      /* vm.displaybg = "display:block";  
     } */


    }

    if (this.nav.getActive() && this.nav.getActive().name === page) {
      return 'primary';
    }
    return;
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    /* const browserLang = this.translate.getBrowserLang(); 
     if (browserLang) {       
         this.translate.use(this.translate.getBrowserLang());      
     } else {
       this.translate.use('en'); // Set your language here
     }*/

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  doToast(str, position){
    let toast = this.toastCtrl.create({
          message: str,
          duration: 6000,
          position: position
        });
        toast.present();
  }

  openPage(page) {
    //console.log("entro")
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

  openAccountDetails() {
    let openupgrd
    openupgrd = this.constant.urlTPWeb + '/#/login?p=';
    let filePath: string = 'usu=' + this.user._useremail + '&pass=' + encodeURIComponent(this.user._userpass) + '&from=accdetail';
    let base64Str: string = window.btoa(filePath);
    window.open(encodeURI(openupgrd + base64Str), "_system", "location=yes");
  }

  openSegmentProfilePage() {
    this.nav.push('SegmentProfilePage');
  }

  checkProfilePermissions() {
    this.btnAccessProf = this.user.validateUserPermissions("User Profile");
    this.btnAccessComp = this.user.validateUserPermissions("User Company");
    
    this.translate.get(['NO_PERMISSION_MESSAGE']).subscribe((value) => {
      this.noAccessString = value.NO_PERMISSION_MESSAGE;                
    })

    if(this.btnAccessProf == 'NoAccess' && this.btnAccessComp == 'NoAccess')
      this.doToast(this.noAccessString, 'bottom');
    else
      this.openSegmentProfilePage();
  }

  logout() {
    this.nav.setRoot(FirstRunPage);
    this.user.logout();
    this.menu.enable(false);    
    this.intercom.reset();
  }
}


/*



  menupages: PageInterface[] = [
  { title: 'RFQs', component: 'RFQsPage', icon: 'information-circle'  }
    { title: 'Tabs', component: 'TabsPage', icon: 'information-circle'  },
    { title: 'Cards', component: 'CardsPage', icon: 'information-circle'  },
    { title: 'Content', component: 'ContentPage', icon: 'information-circle'  },
    { title: 'Master Detail', component: 'ListMasterPage', icon: 'information-circle'  },
    { title: 'Menu', component: 'MenuPage', icon: 'information-circle'  },
    { title: 'Search', component: 'SearchPage', icon: 'information-circle'  }
  ]

  accountpages: PageInterface[] = [
    { title: 'Tutorial', component: 'TutorialPage', icon: 'information-circle'  },
    { title: 'Welcome', component: 'WelcomePage', icon: 'information-circle'  },
    { title: 'Login', component: 'LoginPage', icon: 'information-circle'  },
    { title: 'Signup', component: 'SignupPage', icon: 'information-circle'  },
    { title: 'Settings', component: 'SettingsPage', icon: 'information-circle'  }
  ]


*/