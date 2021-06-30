import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Modal, ModalOptions, NavParams, NavController, List, Refresher, ToastController, LoadingController, MenuController, Platform, PopoverController } from 'ionic-angular';
import { Project, Customer, User } from '../../providers';
import { Item } from '../../models/item';
import { TranslateService } from '@ngx-translate/core';
import { ProjectMenuComponent } from '../../components/project-menu/project-menu';


@IonicPage()
@Component({
  selector: 'page-list-projects',
  templateUrl: 'list-projects.html'
})
export class ListProjectPage {
  currentItems: Item[];
  segment = 'all';
  queryText = '';
  CustomerName = String;
  records: any;
  btnAccess: any;
  btnAccessTransactions: any;

  constructor(
    public navParams: NavParams,
    public menu: MenuController,
    public navCtrl: NavController,
    public translate: TranslateService,
    public customer: Customer,
    public user: User,
    public projects: Project,
    private modal: ModalController,
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

    this.btnAccess = this.user.validateUserPermissions("Projects");
    this.btnAccessTransactions = this.user.validateUserPermissions("Transactions");
    if(this.btnAccess == "NoAccess"){
      this.navCtrl.setRoot('ErrorUnauthorizedPage');
    }
    if(this.btnAccessTransactions == "NoAccess"){
      this.btnAccessTransactions = true;
    }else{
      this.btnAccessTransactions = false;
    }

    this.CustomerName = this.customer._customername;
    this.records = 0;
    let seq = projects.ProjectList(this.records, '');
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

  openModalHelp() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = '';
    let i = 0;
    const myModal: Modal = this.modal.create('ModalPageHelpCenter', { data: myModalData, line: i }, myModalOptions);
    myModal.present();
  }

  doInfinite() {
    this.records = this.records + 20;
    return new Promise((resolve) => {
      setTimeout(() => {
        let seq = this.projects.ProjectList(this.records, '');
        seq.subscribe((res: any) => {
          for (var i = 0; i < res.length; i++) {
            this.currentItems.push(res[i]);
          }
          resolve();
        });
      }, 500);
    })
  }

  @ViewChild('ProjectsList', { read: List }) projectsList: List;

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

  updateLstProjects() {
    // Close any open sliding items when the schedule updates
    this.projectsList && this.projectsList.closeSlidingItems();
    this.currentItems = this.getfilterList(this.queryText)
  }

  getfilterList(queryText = '') {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    this.currentItems.forEach((item: any) => {
      item.hide = true;
      this.filterProjects(item, queryWords);
      if (!item.hide) {
        item.hide = false;
      }
    });
    return this.currentItems;
  }

  filterProjects(item: any, queryWords: string[]) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach((queryWord: string) => {
        if (item.ProjectNumber.toLowerCase().indexOf(queryWord) > -1 ||
          item.ProjectScope.toLowerCase().indexOf(queryWord) > -1 ||
          item.ProjectName.toLowerCase().indexOf(queryWord) > -1) {
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
    let seq = this.projects.ProjectList(this.records, '');

    seq.subscribe((res: any) => {
      this.currentItems = res;
      setTimeout(() => {
        refresher.complete();
        this.translate.get(['PROJECT_LIST_UPDATED']).subscribe((value) => {
          const toast = this.toastCtrl.create({
            message: value.PROJECT_LIST_UPDATED,
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
    this.projects._projectStorage(item)
    this.navCtrl.push('ListTransactionPage');
  }

  async presentPopover(myEvent, projectID, ProjectName, ProjNum) {

    let projectParams = {
      projectID: projectID
    }
    const popover = await this.popoverCtrl.create(ProjectMenuComponent, projectParams, {"cssClass": "popover-ios project-popover"});
    if(this.platform.is('android'))
      this.popoverCtrl.config.set('mode', 'ios');
    this.popoverCtrl.config.settings('showBackdrop', 'true');
    
    await popover.present({ ev: myEvent });
    if(this.platform.is('android'))
      this.popoverCtrl.config.set('mode', 'md');
    await popover.onDidDismiss(data => {      
      if(data!=null){         
         if(data.action == "ProjectTeam"){          
          this.navCtrl.push("ListProjectTeamPage",{ projectid: data.projectid, projectName: ProjectName, projectNum: ProjNum });
         }
      }
    });
    
	}
}
