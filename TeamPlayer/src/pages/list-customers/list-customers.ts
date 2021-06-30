import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, List, Refresher, ToastController, LoadingController, MenuController, Modal, ModalOptions, AlertController, Platform } from 'ionic-angular';
import { Customer, User, Constant, Project, Transaction } from '../../providers';
import { Item } from '../../models/item';
import { TranslateService } from '@ngx-translate/core';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-list-customers',
  templateUrl: 'list-customers.html'
})
export class ListCustomerPage {
  currentItems: Item[];
  segment = 'all';
  queryText = '';
  records: any;
  btnAccess: any;
  btnAccessProjects: any;
  public ViewPremiumContent: boolean
  redirectFlag: boolean = true;

  constructor(
    public user: User,
    public menu: MenuController,
    public navCtrl: NavController,
    public translate: TranslateService,
    public customers: Customer,
    private modal: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    public constant: Constant,
    public projects: Project,
    public transaction: Transaction) {         
      
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
    }
    
    if(this.user._userid && sessionStorage.getItem("redirectSource") && this.redirectFlag){
      const TransactionType = sessionStorage.getItem("redirectSource");
      const TransactionID = sessionStorage.getItem("redirectID");
      sessionStorage.removeItem("redirectSource");
      sessionStorage.removeItem("redirectID");
      this.redirectFunction(TransactionType, TransactionID);
    }

    this.btnAccess = this.user.validateUserPermissions("Customers");
    this.btnAccessProjects = this.user.validateUserPermissions("Projects");
    if(this.btnAccess == "NoAccess")
      this.navCtrl.setRoot('ErrorUnauthorizedPage');
    if(this.btnAccessProjects == "NoAccess")
      this.btnAccessProjects = true;
    else
      this.btnAccessProjects = false;

    this.records = 0;
    this.ViewPremiumContent = this.user._ViewPremiumContent;
    this.user._nulluserpass = window.localStorage.getItem('nulluserpass') ? window.localStorage.getItem('nulluserpass') : '';

    if (this.user._nulluserpass == 1) {
      this.navCtrl.setRoot('LoginPage');
      this.user.logout();
    }

    let seq = customers.CustomerList(this.records);

    this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
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

      seq.subscribe((res: any) => {
        this.currentItems = res;
        this.loadingControl('dismiss', loading)
      });
    })
  }

  ionViewDidEnter() {
    let internalversionandroid
    let internalversionios
    let serverversionandroid
    let serverversionios

    this.user.getVersion().subscribe((resp) => {


      if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
        if (this.platform.is('android') && resp['androidvalidate'] == "yes") {
          let serverandroidcode = resp['android']
          let serverandroidsrt = serverandroidcode.replace(/\./g, '')
          let internalandroidcode = this.constant.versionCodeAndroid
          let internalandroidsrt = internalandroidcode.replace(/\./g, '')
          internalversionandroid = Number(internalandroidsrt)
          serverversionandroid = Number(serverandroidsrt)
        } else if (this.platform.is('ios') && resp['iosvalidate'] == "yes") {
          let serverioscode = resp['ios']
          let serveriossrt = serverioscode.replace(/\./g, '')
          let internalioscode = this.constant.versionCodeiOS
          let internaliossrt = internalioscode.replace(/\./g, '')
          internalversionios = Number(internaliossrt)
          serverversionios = Number(serveriossrt)
        }
      }

      //console.log(internalversionandroid)
      //console.log(serverversionandroid)
      if (internalversionandroid < serverversionandroid) {
        //console.log("android lunch")
        setTimeout(() => {
          this.presentPrompt('com.redteam.tp')
        }, 500)
      } else if (internalversionios < serverversionios) {
        //https://itunes.apple.com/us/app/keynote/id1457745663?mt=8      
        //console.log("ios lunch")  
        setTimeout(() => {
          this.presentPrompt('id1457745663')
        }, 500)
      }
    }, (err) => {
    });
  }

  presentPrompt(store) {
    let alerttitle
    let alertmessage
    let btncontinue

    this.translate.get(['VERSION_ALERT_TITLE']).subscribe((value) => {
      alerttitle = value.VERSION_ALERT_TITLE;
    })

    this.translate.get(['VERSION_ALERT_MESSAGE']).subscribe((value) => {
      alertmessage = value.VERSION_ALERT_MESSAGE;
    })

    this.translate.get(['CONTINUE_BUTTON']).subscribe((value) => {
      btncontinue = value.CONTINUE_BUTTON;
    })

    let alert = this.alertCtrl.create({
      title: alerttitle,
      message: alertmessage,
      buttons: [
        {
          text: btncontinue,
          handler: data => {
            cordova.plugins.market.open(store)
            this.platform.exitApp()
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  doInfinite() {
    this.records = this.records + 20;
    return new Promise((resolve) => {
      setTimeout(() => {
        let seq = this.customers.CustomerList(this.records);
        seq.subscribe((res: any) => {
          for (var i = 0; i < res.length; i++) {
            this.currentItems.push(res[i]);
          }
          resolve();
        });
      }, 500);
    })
  }

  @ViewChild('CustomersList', { read: List }) customersList: List;

  ionViewDidLoad() {
    this.menu.enable(true);
  }

  loadingControl(band = '', loading) {
    if (band === 'start') {
      loading.present();
    } else {
      loading.dismiss();
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

  updateLstCustomers() {
    // Close any open sliding items when the schedule updates
    this.customersList && this.customersList.closeSlidingItems();
    this.currentItems = this.getfilterList(this.queryText)
  }

  getfilterList(queryText = '') {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    this.currentItems.forEach((item: any) => {
      item.hide = true;
      this.filterCustomers(item, queryWords);
      if (!item.hide) {
        item.hide = false;
      }
    });
    return this.currentItems;
  }

  filterCustomers(item: any, queryWords: string[]) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach((queryWord: string) => {
        if (item.CustomerName.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

  doRefresh(refresher: Refresher) {

    this.queryText = "";
    this.records = 0;
    let seq = this.customers.CustomerList(this.records);
    seq.subscribe((res: any) => {
      this.currentItems = res;
      setTimeout(() => {
        refresher.complete();
        this.translate.get(['CUSTOMER_LIST_UPDATED']).subscribe((value) => {
          const toast = this.toastCtrl.create({
            message: value.CUSTOMER_LIST_UPDATED,
            duration: 3000
          });
          toast.present();
        });
      }, 1000);
    });
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  /*addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }*/

  deleteItem(item) {
    //this.items.delete(item);
  }

  openItem(item: Item) {
    this.customers._customerStorage(item);
    this.user._UserCompanyConfig(item);
    this.navCtrl.push('ListProjectPage');
  }

  redirectFunction(TransactionType, TransactionID){

    let loading;
    this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<div class="spinner-loading"> 
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>` + value.LOADING_MESSAGE

      });
      this.loadingControl('start', loading);
    });

    this.redirectFlag = false;    
    let nextItem = "";

    if (TransactionType == "Contract") {
      nextItem = "CommitmentDetailPage";
    } else {
      nextItem = "RFQDetailPage";
    }
    
    let params = { userid: this.user._userid, companyid: this.user._usercompanyid, type: TransactionType, transactionid: TransactionID };
    new Promise(resolve => {
      this.transaction.TransactionById(params).subscribe((resp: any) => {
        
        if(resp){

          this.customers._customerid = resp.FK_TACompanyId_tp;
          this.projects._projectnumber = resp.rtProjectNumber_tp;

          //Customers
          this.customers.CustomerList(this.records).subscribe((custm: any) => {
            custm.forEach((value, index) => {
              //if(resp.PK_CompanyId_tp == value.CustomerID){
              if(resp.FK_TACompanyId_tp == value.CustomerID){                
                this.customers._customerStorage(custm[index]);
                this.user._UserCompanyConfig(custm[index]);

                //Projects        
                this.projects.ProjectList(this.records, resp.PK_ProjectId_tp).subscribe((project: any) => {                
                  this.projects._projectStorage(project[0]);
                  //Transactions
                  this.transaction.TransactionList(this.records, resp.PK_TransactionId_tp).subscribe((trans: any) => {                  
                        this.transaction._transactionStorage(trans[0])
                        sessionStorage.removeItem("redirectSource");
                        sessionStorage.removeItem("redirectID");          
                        this.navCtrl.push(nextItem);
                        resolve(resp);
                  });
                });
                //---
              }                         
            });
          });
          this.loadingControl('dismiss', loading)
        } else {
          sessionStorage.removeItem("redirectSource");
          sessionStorage.removeItem("redirectID");
          this.loadingControl('dismiss', loading)
        }
      
      });
    });        

  }
}
