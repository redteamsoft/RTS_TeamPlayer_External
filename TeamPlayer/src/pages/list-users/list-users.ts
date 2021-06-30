import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Modal, ModalOptions, NavController, List, Refresher, ToastController, LoadingController, MenuController, Platform } from 'ionic-angular';
import { User } from '../../providers';
import { Item } from '../../models/item';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-list-users',
  templateUrl: 'list-users.html'
})
export class ListUserPage {
  // currentItems: Item[];
  precurrentItems: Item[];
  segment = 'all';
  queryText = '';
  records: any;
  currentItems = [];
  group = '';
  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public translate: TranslateService,
    public user: User,
    public toastCtrl: ToastController,
    private modal: ModalController,
    public platform: Platform,
    public loadingCtrl: LoadingController) {
    this.records = 0;

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

    this.loadUsers();
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

  loadUsers() {
    let seq = this.user.UserList(this.user._usercompanyid, this.records);

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
        this.setCurrentItems(res, loading, true)
      });
    })
  }

  ionViewWillEnter() {
    if (this.user._refreshpage == "true") {
      this.user._refreshpage = "false";
      this.loadUsers();
    }

    let userprofilerecord = this.currentItems.find(x => x.Email == this.user._useremail);
    if (userprofilerecord) {
      userprofilerecord.FirstName = this.user._userfirstname;
      userprofilerecord.LastName = this.user._userlastname;
      userprofilerecord.Mobile = this.user._usermobile;
      userprofilerecord.UserPass = this.user._userpass;
    }
  }

  setCurrentItems(res: any, loading, band) {
    if (band)
      this.currentItems = [];

    this.precurrentItems = res;

    let hide = false;
    if (this.precurrentItems.length > 0) {
      for (let i = 0; i <= this.precurrentItems.length - 1; i++) {
        if (this.precurrentItems[i].DiaplsyOrder != this.group) {
          this.group = this.precurrentItems[i].DiaplsyOrder;
          hide = false;
        }
        else {
          hide = true;
        }

        let strUserFirstName = this.precurrentItems[i].FirstName
        strUserFirstName = strUserFirstName.charAt(0).toUpperCase()
        let strUserLastName = this.precurrentItems[i].LastName
        strUserLastName = strUserLastName.charAt(0).toUpperCase()
        let uAvatarLetter = strUserFirstName + strUserLastName;


        var postCurrentItems = {
          "DiaplsyOrder": this.group,
          "Email": this.precurrentItems[i].Email,
          "FirstName": this.precurrentItems[i].FirstName,
          "InvitationStatus": this.precurrentItems[i].InvitationStatus,
          "LastName": this.precurrentItems[i].LastName,
          "Mobile": this.precurrentItems[i].Mobile,
          "UserId": this.precurrentItems[i].UserId,
          "UserPass": this.precurrentItems[i].UserPass,
          "Position": this.precurrentItems[i].Position,
          "groupHide": hide,
          "uAvatarLetter": uAvatarLetter,
        }


        /*let element = document.getElementById(this.precurrentItems[i].UserId);
        
        element.setAttribute("style", "border-left: 2px solid #DEDEDE;");*/

        //element.classList.add('border-list')
        // border-list

        this.currentItems.push(postCurrentItems)
      }
    }
    if (loading != '')
      this.loadingControl('dismiss', loading)
  }

  doInfinite() {
    this.records = this.records + 20;
    return new Promise((resolve) => {
      setTimeout(() => {
        let seq = this.user.UserList(this.user._usercompanyid, this.records);
        seq.subscribe((res: any) => {

          this.setCurrentItems(res, '', false)

          resolve();
        });
      }, 500);
    })
  }

  @ViewChild('UsersList', { read: List }) UsersList: List;

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

  updateLstUsers() {
    // Close any open sliding items when the schedule updates
    this.UsersList && this.UsersList.closeSlidingItems();
    this.currentItems = this.getfilterList(this.queryText)
  }

  getfilterList(queryText = '') {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    this.currentItems.forEach((item: any) => {
      item.hide = true;
      this.filterUsers(item, queryWords);
      if (!item.hide) {
        item.hide = false;
      }
    });
    return this.currentItems;
  }

  filterUsers(item: any, queryWords: string[]) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach((queryWord: string) => {
        if (item.FirstName.toLowerCase().indexOf(queryWord) > -1 || item.LastName.toLowerCase().indexOf(queryWord) > -1) {
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
    let seq = this.user.UserList(this.user._usercompanyid, this.records);
    seq.subscribe((res: any) => {
      this.setCurrentItems(res, '', true)
      setTimeout(() => {
        refresher.complete();
        this.translate.get(['USER_LIST_UPDATED']).subscribe((value) => {
          const toast = this.toastCtrl.create({
            message: value.USER_LIST_UPDATED,
            duration: 3000
          });
          toast.present();
        });
      }, 1000);
    });
  }

  openItem(item: Item) {
    let params = {
      Item: item
    }
    this.navCtrl.push('UserProfilePage', params);
  }
}
