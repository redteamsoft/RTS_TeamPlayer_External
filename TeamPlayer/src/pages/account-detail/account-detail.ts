import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, LoadingController, ToastController, ModalController, ModalOptions, Modal } from 'ionic-angular';
import { User } from '../../providers';

//import { Settings } from '../../providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-account-detail',
  templateUrl: 'account-detail.html'
})
export class AccountDetailPage {
  // Our local settings object  
  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;
  ViewPremiun: boolean = false;
  accountPlan: any;
  accountSince: any;
  accountServiceEnds: any;


  constructor(public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private modal: ModalController,
    public user: User,
    public translate: TranslateService) {

    this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
    });


    this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
      this.CONNECTION_ERROR = value.CONNECTION_ERROR;
    });


  }

  ngOnInit() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="spinner-loading"> 
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				</div>` + this.LOADING_MESSAGE
    });

    this.loadingControl('start', loading);

    let seq = this.user.AccountDetails();

    seq.subscribe((res: any) => {
      this.loadingControl('dismiss', loading);
      console.log(res)
      this.accountPlan = res[0].BusinessProductName;
      this.accountSince = res[0].Since;

      if (res[0].BusinessProductID == 8) {
        this.ViewPremiun = true;
        this.accountServiceEnds = res[0].ServiceEnds;
      }


    }), (err) => {
      this.doToast(this.CONNECTION_ERROR);
      this.loadingControl('dismiss', loading);
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


}
