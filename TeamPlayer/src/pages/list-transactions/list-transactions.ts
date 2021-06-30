import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Modal, ModalOptions, NavParams, NavController, List, Refresher, ToastController, LoadingController, MenuController, Platform, PopoverController } from 'ionic-angular';
import { Transaction, Customer, Project, User } from '../../providers';
import { Item } from '../../models/item';
import { TranslateService } from '@ngx-translate/core';
import { ProjectMenuComponent } from '../../components/project-menu/project-menu';

@IonicPage()
@Component({
  selector: 'page-list-transactions',
  templateUrl: 'list-transactions.html'
})
export class ListTransactionPage {
  currentItems: Item[];
  segment = 'all';
  queryText = '';
  item: any;
  lblCustomerName = String;
  lblProjectID = String;
  lblScope = String;
  lblProjectName = String;
  records: any;
  btnAccess: any;
  btnAccessContracts: any;
  btnAccessRFQs: any;
  btnAccessQuotes: any;
  ProjectID: any;

  constructor(
    public customer: Customer,
    public project: Project,
    public user: User,
    public navParams: NavParams,
    public menu: MenuController,
    public navCtrl: NavController,
    public translate: TranslateService,
    private modal: ModalController,
    public transaction: Transaction,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController) {   

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

    this.btnAccess = this.user.validateUserPermissions("Transactions");
    this.btnAccessContracts = this.user.validateUserPermissions("Contracts");
    this.btnAccessRFQs = this.user.validateUserPermissions("RFQs");
    this.btnAccessQuotes = this.user.validateUserPermissions("Quotes");
    if(this.btnAccess == "NoAccess"){
      this.navCtrl.setRoot('ErrorUnauthorizedPage');
    } 
    if(this.btnAccessContracts == "NoAccess") this.btnAccessContracts = true; else this.btnAccessContracts = false;
    if(this.btnAccessRFQs == "NoAccess") this.btnAccessRFQs = true; else this.btnAccessRFQs = false;
    if(this.btnAccessQuotes == "NoAccess") this.btnAccessQuotes = true; else this.btnAccessQuotes = false;

    this.lblCustomerName = this.customer._customername;
    this.ProjectID = this.project._projectid;
    this.lblProjectID = this.project._rtProjNum;
    this.lblProjectName = this.project._projectname;
    this.lblScope = this.project._projectscope;
    this.records = 0;
    this.loadTransaction()
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

  ionViewWillEnter() {
    if (this.user._refreshprevpage == "true") {
      this.user._refreshprevpage = "false";
      this.loadTransaction()
    }
  }

  loadTransaction() {
    let seq = this.transaction.TransactionList(this.records, '');
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

  doInfinite() {
    this.records = this.records + 20;
    return new Promise((resolve) => {
      setTimeout(() => {
        let seq = this.transaction.TransactionList(this.records, '');
        seq.subscribe((res: any) => {
          for (var i = 0; i < res.length; i++) {
            this.currentItems.push(res[i]);
          }
          resolve();
        });
      }, 500);
    })
  }

  @ViewChild('rfqList', { read: List }) rfqList: List;

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

  updateLstRFQ() {
    // Close any open sliding items when the schedule updates
    this.rfqList && this.rfqList.closeSlidingItems();
    this.currentItems = this.getfilterList(this.queryText)
  }

  getfilterList(queryText = '') {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    this.currentItems.forEach((item: any) => {
      item.hide = true;
      this.filterRFQ(item, queryWords);
      if (!item.hide) {
        item.hide = false;
      }
    });
    return this.currentItems;
  }

  filterRFQ(item: any, queryWords: string[]) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach((queryWord: string) => {
        if (item.ProjectID.toLowerCase().indexOf(queryWord) > -1 ||
          item.ProjectName.toLowerCase().indexOf(queryWord) > -1 ||
          item.Subject.toLowerCase().indexOf(queryWord) > -1 ||
          item.Company.toLowerCase().indexOf(queryWord) > -1) {
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
    let seq = this.transaction.TransactionList(this.records, '');
    seq.subscribe((res: any) => {
      this.currentItems = res;

      setTimeout(() => {
        refresher.complete();
        this.translate.get(['TRANSACTION_LIST_UPDATED']).subscribe((value) => {
          const toast = this.toastCtrl.create({
            message: value.TRANSACTION_LIST_UPDATED,
            duration: 3000
          });
          toast.present();
        });
      }, 1000);
    });
  }

  deleteItem(item) {
    //this.items.delete(item);
  }

  openItem(item: Item) {
    let nextItem = "";

    if (item.TransactionType == "Contract") {
      nextItem = "CommitmentDetailPage";
    } else {
      nextItem = "RFQDetailPage";
    }

    this.transaction._transactionStorage(item)
    this.navCtrl.push(nextItem);
  }

  async ProjectMenuPopover(myEvent, projectID) {

    let projectParams = {
      projectID: projectID
    }
    const popover = await this.popoverCtrl.create(ProjectMenuComponent, projectParams, { cssClass: "poiqwe123" });    
    if(this.platform.is('android'))
      this.popoverCtrl.config.set('mode', 'ios');   

    await popover.present({ ev: myEvent });
    if(this.platform.is('android'))
      this.popoverCtrl.config.set('mode', 'md');
    await popover.onDidDismiss(data => {      
      if(data!=null){         
         if(data.action == "ProjectTeam"){          
          this.navCtrl.push("ListProjectTeamPage",{ projectid: data.projectid, projectName: this.lblProjectName, projectNum: this.lblProjectID });
         }
      }
    });
	}
}
