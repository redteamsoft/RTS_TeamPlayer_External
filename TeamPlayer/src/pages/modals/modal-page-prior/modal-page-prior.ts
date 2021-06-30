import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, Project } from '../../../providers';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-page-prior',
  templateUrl: 'modal-page-prior.html',
})
export class ModalPagePrior {

  UnitCost = 0;
  CompletedToDate: Number = 0;
  PresentlyStored = 0;
  CompletedStored = 0;
  PriorBilling: any;
  ThisPeriod = 0;
  AcumulativeComplete = 0;
  Open = 0;
  Line = 0;
  CostCode = "";
  Description = "";
  ListPriorBilling: any;
  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;
  BILL_LINE_CONTRACT_VALUE_WARNING: any;
  BILL_PRIOR_BILLING_WARNING: any;


  constructor(
    private navParams: NavParams,
    private view: ViewController,
    public translate: TranslateService,
    public transaction: Transaction,
    public project: Project,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    const line = this.navParams.get('line');

    this.CostCode = data.boLineCstcde.value;
    this.Description = data.PrtTitle.value;
    this.UnitCost = data.UnitCost.value;
    this.CompletedToDate = data.CompletedToDate.value;
    this.PresentlyStored = data.PresentlyStored.value;
    this.CompletedStored = data.CompletedStored.value;
    this.PriorBilling = this.transaction.getCurrency(this.transaction.getNumber(data.Prior.value));
    this.ThisPeriod = data.ThisPeriod.value;
    this.AcumulativeComplete = data.AcumulativeComplete.value;
    this.Open = data.Open.value;
    this.Line = line;

    this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
    });

    this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
      this.CONNECTION_ERROR = value.CONNECTION_ERROR;
    });

    this.translate.get(['BILL_LINE_CONTRACT_VALUE_WARNING']).subscribe((value) => {
      this.BILL_LINE_CONTRACT_VALUE_WARNING = value.BILL_LINE_CONTRACT_VALUE_WARNING;
    });

    this.translate.get(['BILL_PRIOR_BILLING_WARNING']).subscribe((value) => {
      this.BILL_PRIOR_BILLING_WARNING = value.BILL_PRIOR_BILLING_WARNING;
    });


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
    let seq = this.transaction.PriorBilling(data.BOLineID.value, this.transaction._transactionid);

    seq.subscribe((res: any) => {
      this.ListPriorBilling = res;
      this.loadingControl('dismiss', loading);
    }), (err) => {
      this.loadingControl('dismiss', loading);
      this.doToast(this.CONNECTION_ERROR);
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

  confirmModal() {
    const data = {
      CompletedToDate: this.CompletedToDate,
      PresentlyStored: this.PresentlyStored,
      CompletedStored: this.CompletedStored,
      ThisPeriod: this.ThisPeriod,
      AcumulativeComplete: this.AcumulativeComplete,
      CurrentOpen: this.Open,
      Line: this.Line
    };
    this.view.dismiss(data);
  }

  cancelModal() {
    this.view.dismiss();
  }

  ToolTip(message: string) {

    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }


}
