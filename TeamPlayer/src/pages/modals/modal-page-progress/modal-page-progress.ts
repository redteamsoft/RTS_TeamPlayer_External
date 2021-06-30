import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction } from '../../../providers';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-page-progress',
  templateUrl: 'modal-page-progress.html',
})
export class ModalPageProgress {

  UnitCost = 0;
  CompletedToDate: any;
  PresentlyStored: any;
  CompletedStored = 0;
  PriorBilling = 0;
  ThisPeriod: any;
  AcumulativeComplete: any;
  ThisPeriodPercent: any;
  Open = 0;
  Line = 0;
  CostCode = "";
  Description = "";
  Status: any;
  BILL_LINE_CONTRACT_VALUE_WARNING: any;
  BILL_LINE_PRESENTLY_WARNING: any;
  BILL_LINE_COMPLETED_DATE_WARNING: any;
  BILL_LINE_COMPLETED_STORED_WARNING: any;
  BILL_LINE_LESS_PRIOR_WARNING: any;
  BILL_LINE_THIS_PERIOD_WARNING: any;
  BILL_LINE_OPEN_WARNING: any;
  BILL_LINE_PROGRESS_PERCENT_WARNING: any;
  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;
  BILL_WARNING_SAGE300: any;
  EnterProgress: any;
  EnterPeriod: any;
  TotalBills: any;
  PreviousCompletedToDate: number;
  PreviousPresentlyStored: number;
  PreferenceBilling: any;
  inputReadonly: boolean = true;

  MinThisPeriodAmount: number;
  MaxThisPeriodAmount: number;
  MinThisPeriodPercent: number;
  MaxThisPeriodPercent: number;
  MinPresentlyAmount: number;
  MaxPresentlyAmount: number;

  IsCompanySage300: any;
	Alias: any;


  constructor(
    private navParams: NavParams,
    private view: ViewController,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public transaction: Transaction,
    public alertCtrl: AlertController) {
      this.translate.get([
        'BILL_LINE_CONTRACT_VALUE_WARNING',
        'BILL_LINE_PRESENTLY_WARNING',
        'BILL_LINE_COMPLETED_DATE_WARNING',
        'BILL_LINE_PROGRESS_PERCENT_WARNING',
        'BILL_LINE_COMPLETED_STORED_WARNING',
        'BILL_LINE_LESS_PRIOR_WARNING',
        'BILL_LINE_THIS_PERIOD_WARNING',
        'BILL_LINE_OPEN_WARNING',
        'LOADING_MESSAGE',
        'CONNECTION_ERROR',
        'BILL_WARNING_SAGE300'
        ]).subscribe((value) => {

          this.BILL_LINE_CONTRACT_VALUE_WARNING = value.BILL_LINE_CONTRACT_VALUE_WARNING;
          this.BILL_LINE_PRESENTLY_WARNING = value.BILL_LINE_PRESENTLY_WARNING;
          this.BILL_LINE_COMPLETED_DATE_WARNING = value.BILL_LINE_COMPLETED_DATE_WARNING;
          this.BILL_LINE_PROGRESS_PERCENT_WARNING = value.BILL_LINE_PROGRESS_PERCENT_WARNING;
          this.BILL_LINE_COMPLETED_STORED_WARNING = value.BILL_LINE_COMPLETED_STORED_WARNING;
          this.BILL_LINE_LESS_PRIOR_WARNING = value.BILL_LINE_LESS_PRIOR_WARNING;
          this.BILL_LINE_THIS_PERIOD_WARNING = value.BILL_LINE_THIS_PERIOD_WARNING;
          this.BILL_LINE_OPEN_WARNING = value.BILL_LINE_OPEN_WARNING;
          this.LOADING_MESSAGE = value.LOADING_MESSAGE;
          this.CONNECTION_ERROR = value.CONNECTION_ERROR;
          this.BILL_WARNING_SAGE300 = value.BILL_WARNING_SAGE300;

      });
  }

  ionViewWillLoad() {
    //this.PreferenceBilling = "ThisPeriod";
    
    const data = this.navParams.get('data');
    const line = this.navParams.get('line');
    const dataTotalBills = this.navParams.get('TotalBills');
    this.PreferenceBilling = this.navParams.get('PreferenceBilling');
    this.IsCompanySage300 = this.navParams.get('IsCompanySage300');
    this.Alias = this.navParams.get('Alias');
    this.TotalBills = dataTotalBills;

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
    let seq = this.transaction.PreviousLineBill(data.BOLineID.value);

    seq.subscribe((res: any) => {
      if (this.TotalBills == 0) {
        this.PreviousCompletedToDate = 0;
        this.PreviousPresentlyStored = 0;
      } else {
        this.PreviousCompletedToDate = res[0].CompletedToDate_tp;
        this.PreviousPresentlyStored = res[0].PresentlyStored_tp;
      }

      this.Status = data.Status.value;
      if (!this.Status) {
        this.CostCode = data.boLineCstcde.value;
        this.Description = data.PrtTitle.value;
        this.UnitCost = this.transaction.getNumber(data.UnitCost.value);
        this.CompletedToDate = this.PreviousCompletedToDate + this.transaction.getNumber(data.CompletedToDate.value);

        if (this.transaction.getNumber(data.PresentlyStored.value) > 0) {
          this.PresentlyStored = this.transaction.getNumber(data.PresentlyStored.value);
        } else {
          this.PresentlyStored = this.PreviousPresentlyStored;
        }

        this.PriorBilling = this.transaction.getNumber(data.Prior.value);
        this.EnterProgress = 'amount';
        this.EnterPeriod = "amount";
        this.Line = line;
      } else {
        this.CostCode = data.boLineCstcde.value;
        this.Description = data.PrtTitle.value;
        this.UnitCost = this.transaction.getNumber(data.UnitCost.value);
        this.CompletedToDate = this.transaction.getNumber(this.PreviousCompletedToDate + data.CompletedToDate.value);
        this.PresentlyStored = this.transaction.getNumber(data.PresentlyStored.value);
        this.PriorBilling = this.transaction.getNumber(data.Prior.value);
        this.EnterProgress = data.EnterProgress.value;
        this.EnterPeriod = data.EnterPeriod.value;
        this.Line = line;
      }
      this.CompletedToDate = this.transaction.getCurrency(this.CompletedToDate);
      this.PresentlyStored = this.transaction.getCurrency(this.PresentlyStored);
      this.ThisPeriod = this.transaction.getCurrency(this.ThisPeriod);
      //RECALC
      this.onChangeValue();

      //CALC MIN & MAX
      this.MinThisPeriodAmount = Number(this.UnitCost) > 0 ? 0 : Number(this.UnitCost);
      this.MaxThisPeriodAmount = Number(this.UnitCost) > 0 ? Number((Number(this.UnitCost) - Number(this.PriorBilling)).toFixed(2)) : 0;
      this.MinThisPeriodPercent = 0;
      this.MaxThisPeriodPercent = Number(this.UnitCost) != 0 ? Number((Number(this.UnitCost) - Number(this.PriorBilling)).toFixed(2)) / Number(this.UnitCost) : 0;
      this.MinPresentlyAmount = Number(this.UnitCost) > 0 ? 0 : Number(this.UnitCost);
      this.MaxPresentlyAmount = Number(this.UnitCost) > 0 ? Number(this.UnitCost) : 0; 

      this.loadingControl('dismiss', loading);

      //SAGE 300
      if(this.IsCompanySage300 == 'YES' && this.Alias != ''){      
        this.showConfirmSage300();
      }
    }), (err) => {
      this.loadingControl('dismiss', loading);
      this.doToast(this.CONNECTION_ERROR);
    }

  }

  confirmModal() {
    const data = {
      CompletedToDate: this.transaction.getNumber(this.CompletedToDate) - this.PreviousCompletedToDate,
      PresentlyStored: this.transaction.getNumber(this.PresentlyStored),
      CompletedStored: this.CompletedStored,
      ThisPeriod: this.transaction.getNumber(this.ThisPeriod),
      AcumulativeComplete: this.transaction.getNumberPercent(this.AcumulativeComplete),
      CurrentOpen: this.Open,
      EnterProgress: this.EnterProgress,
      EnterPeriod: this.EnterPeriod,
      Line: this.Line,
      Status: true,
      PreferenceBilling: this.PreferenceBilling
    };
    this.view.dismiss(data);
  }

  cancelModal() {
    this.view.dismiss();
  }

  onChangeValue() {
    if (isNaN(this.transaction.getNumber(this.PresentlyStored))) {
      this.PresentlyStored = this.transaction.getCurrency(0);
    }

    if (isNaN(this.transaction.getNumber(this.CompletedToDate))) {
      this.CompletedToDate = this.transaction.getCurrency(0);
    }

    let AcumulativeCompleteDecimals = 0;
    let ThisPeriodPErcentDecimals = 0;

    this.CompletedStored = this.transaction.getNumber(this.CompletedToDate) + this.transaction.getNumber(this.PresentlyStored);
    this.ThisPeriod = this.transaction.getCurrency(Number((Number(this.CompletedStored) - Number(this.PriorBilling)).toFixed(2)));
    AcumulativeCompleteDecimals = ((this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling)) / Number(this.UnitCost)) * 100;
    this.AcumulativeComplete = this.transaction.getPercent(Number(AcumulativeCompleteDecimals.toFixed(2)) / 100);
    ThisPeriodPErcentDecimals = ((this.transaction.getNumber(this.ThisPeriod)) / Number(this.UnitCost)) * 100;
    this.ThisPeriodPercent = this.transaction.getPercent(Number(ThisPeriodPErcentDecimals.toFixed(2)) / 100);
    this.Open = Number(this.UnitCost) - Number(this.CompletedStored);
    this.CompletedToDate = this.transaction.getCurrency(this.transaction.getNumber(this.CompletedToDate));
    this.PresentlyStored = this.transaction.getCurrency(this.transaction.getNumber(this.PresentlyStored));
  }

  onChangePresently(oldValue: any) {
    if (isNaN(this.transaction.getNumber(this.PresentlyStored))) {
      this.PresentlyStored = this.transaction.getCurrency(0);
    }

    let AcumulativeCompleteDecimals = 0;
    let ThisPeriodPercentDecimals = 0;
    if (this.PreferenceBilling == 'CompletedToDate') {
      this.CompletedStored = this.transaction.getNumber(this.CompletedToDate) + this.transaction.getNumber(this.PresentlyStored);

      if (Number(this.CompletedStored) >= Math.min(Number(this.UnitCost), 0) && Number(this.CompletedStored) <= Math.max(Number(this.UnitCost), 0)) {
        this.ThisPeriod = this.transaction.getCurrency(Number((Number(this.CompletedStored) - Number(this.PriorBilling)).toFixed(2)));
        ThisPeriodPercentDecimals = (this.transaction.getNumber(this.ThisPeriod) / Number(this.UnitCost)) * 100;
        this.ThisPeriodPercent = this.transaction.getPercent(Number(ThisPeriodPercentDecimals.toFixed(2)) / 100);
        AcumulativeCompleteDecimals = ((this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling)) / Number(this.UnitCost)) * 100;
        this.AcumulativeComplete = this.transaction.getPercent(Number(AcumulativeCompleteDecimals.toFixed(2)) / 100);
        this.Open = Number(this.UnitCost) - Number(this.CompletedStored);
        this.CompletedToDate = this.transaction.getCurrency(this.transaction.getNumber(this.CompletedToDate));
        this.PresentlyStored = this.transaction.getCurrency(this.transaction.getNumber(this.PresentlyStored));
      } else {
        this.PresentlyStored = oldValue;
        this.CompletedStored = this.transaction.getNumber(this.CompletedToDate) + this.transaction.getNumber(this.PresentlyStored);
        this.ToolTip("Presently Stored is invalid!");
      }
    } else {

      if (this.transaction.getNumber(this.PresentlyStored) >= this.MinPresentlyAmount && this.transaction.getNumber(this.PresentlyStored) <= this.MaxPresentlyAmount) {
        this.CompletedStored = Number(this.PriorBilling) + this.transaction.getNumber(this.ThisPeriod);
        //this.CompletedToDate = Number(this.CompletedStored) - this.transaction.getNumber(this.PresentlyStored);
        this.CompletedToDate = this.transaction.getCurrency(this.transaction.getNumber(Number(this.CompletedStored) - this.transaction.getNumber(this.PresentlyStored)));
        this.PresentlyStored = this.transaction.getCurrency(this.transaction.getNumber(this.PresentlyStored));
        AcumulativeCompleteDecimals = ((this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling)) / Number(this.UnitCost)) * 100;
        this.AcumulativeComplete = this.transaction.getPercent(Number(AcumulativeCompleteDecimals.toFixed(2)) / 100);
        this.Open = Number(this.UnitCost) - Number(this.CompletedStored);
        ThisPeriodPercentDecimals = (this.transaction.getNumber(this.ThisPeriod) / Number(this.UnitCost)) * 100;
        this.ThisPeriodPercent = this.transaction.getPercent(Number(ThisPeriodPercentDecimals.toFixed(2)) / 100);
      } else {
        this.PresentlyStored = oldValue;
        //this.CompletedStored = this.transaction.getNumber(this.CompletedToDate) + this.transaction.getNumber(this.PresentlyStored);
        this.ToolTip("Presently Stored is invalid!");
      }

    }
  }

  onChangeCompletedToDate(oldValue: any) {

    if (isNaN(this.transaction.getNumber(this.CompletedToDate))) {
      this.CompletedToDate = this.transaction.getCurrency(0);
    }

    let AcumulativeCompleteDecimals = 0;
    let ThisPeriodPercentDecimals = 0;
    this.CompletedStored = this.transaction.getNumber(this.CompletedToDate) + this.transaction.getNumber(this.PresentlyStored);

    if (Number(this.CompletedStored) >= Math.min(Number(this.UnitCost), 0) && Number(this.CompletedStored) <= Math.max(Number(this.UnitCost), 0)) {
      this.ThisPeriod = this.transaction.getCurrency(Number((Number(this.CompletedStored) - Number(this.PriorBilling)).toFixed(2)));
      ThisPeriodPercentDecimals = (this.transaction.getNumber(this.ThisPeriod) / Number(this.UnitCost)) * 100;
      this.ThisPeriodPercent = this.transaction.getPercent(Number(ThisPeriodPercentDecimals.toFixed(2)) / 100);
      AcumulativeCompleteDecimals = ((this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling)) / Number(this.UnitCost)) * 100;
      this.AcumulativeComplete = this.transaction.getPercent(Number(AcumulativeCompleteDecimals.toFixed(2)) / 100);
      this.Open = Number(this.UnitCost) - Number(this.CompletedStored);
      this.CompletedToDate = this.transaction.getCurrency(this.transaction.getNumber(this.CompletedToDate));
      this.PresentlyStored = this.transaction.getCurrency(this.transaction.getNumber(this.PresentlyStored));
    } else {
      this.CompletedToDate = oldValue;
      this.CompletedStored = this.transaction.getNumber(this.CompletedToDate) + this.transaction.getNumber(this.PresentlyStored);
      this.ToolTip("Completed to Date is invalid!");
    }
  }

  onChangePercent(oldValue: any) {
    let ThisPeriodPercentDecimals = 0;
    let percentAmount = (Number(this.AcumulativeComplete) / 100);
    if (percentAmount > 1 || Number.isNaN(percentAmount) || percentAmount < 0) {
      this.AcumulativeComplete = oldValue;
      this.ToolTip("Progress Percent is invalid!");
    } else {
      var unformatAmount = (this.UnitCost * percentAmount) - this.transaction.getNumber(this.PresentlyStored);
      this.CompletedToDate = Number(unformatAmount.toFixed(2));
      this.CompletedStored = Number(this.CompletedToDate) + Number(this.transaction.getNumber(this.PresentlyStored));
      this.ThisPeriod = this.transaction.getCurrency(Number((Number(this.CompletedStored) - Number(this.PriorBilling)).toFixed(2)));
      ThisPeriodPercentDecimals = (this.transaction.getNumber(this.ThisPeriod) / Number(this.UnitCost)) * 100;
      this.ThisPeriodPercent = this.transaction.getPercent(Number(ThisPeriodPercentDecimals.toFixed(2)) / 100);
      this.Open = Number(this.UnitCost) - Number(this.CompletedStored);
      this.AcumulativeComplete = this.transaction.getPercent(percentAmount);
      this.CompletedToDate = this.transaction.getCurrency(this.CompletedToDate);
    }
  }

  onChangeThisPeriod(oldValue: any) {
    if (isNaN(this.transaction.getNumber(this.ThisPeriod))) {
      this.ThisPeriod = this.transaction.getCurrency(0);
    }

    let AcumulativeCompleteDecimals = 0;
    let ThisPeriodPErcentDecimals = 0;
    if (Number(this.ThisPeriod) >= this.MinThisPeriodAmount && Number(this.ThisPeriod) <= this.MaxThisPeriodAmount) {
      this.CompletedStored = this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling);
      this.CompletedToDate = this.transaction.getCurrency(this.transaction.getNumber(Number(this.CompletedStored) - this.transaction.getNumber(this.PresentlyStored)));
      //this.CompletedToDate = this.transaction.getCurrency(this.transaction.getNumber(this.CompletedToDate));
      AcumulativeCompleteDecimals = ((this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling)) / Number(this.UnitCost)) * 100;
      this.AcumulativeComplete = this.transaction.getPercent(Number(AcumulativeCompleteDecimals.toFixed(2)) / 100);
      this.Open = Number(this.UnitCost) - Number(this.CompletedStored);
      this.ThisPeriod = this.transaction.getCurrency(this.transaction.getNumber(this.ThisPeriod));
      ThisPeriodPErcentDecimals = (this.transaction.getNumber(this.ThisPeriod) / Number(this.UnitCost)) * 100;
      this.ThisPeriodPercent = this.transaction.getPercent(Number(ThisPeriodPErcentDecimals.toFixed(2)) / 100);
    } else {
      this.ThisPeriod = oldValue;
      //this.ThisPeriod = this.transaction.getNumber(this.ThisPeriod);
      this.ToolTip("This Period Completed Amount is invalid!");
    }


  }

  onChangeThisPeriodPercent(oldValue: any) {
    let percentAmount = (Number(this.ThisPeriodPercent) / 100);
    let AcumulativeCompleteDecimals = 0;
    if (percentAmount < this.MinThisPeriodPercent || percentAmount > this.MaxThisPeriodPercent || Number.isNaN(percentAmount)) {
      this.ThisPeriodPercent = oldValue;
      this.ToolTip("This Period Completed Percent is invalid!");
    } else {
      this.ThisPeriod = Number((this.UnitCost * percentAmount).toFixed(2));
      this.CompletedStored = Number(this.PriorBilling) + Number(this.transaction.getNumber(this.ThisPeriod));
      this.CompletedToDate = Number(this.CompletedStored) - Number(this.transaction.getNumber(this.PresentlyStored));
      AcumulativeCompleteDecimals = ((this.transaction.getNumber(this.ThisPeriod) + Number(this.PriorBilling)) / Number(this.UnitCost)) * 100;
      this.AcumulativeComplete = this.transaction.getPercent(Number(AcumulativeCompleteDecimals.toFixed(2)) / 100);
      this.Open = Number(this.UnitCost) - Number(this.CompletedStored);

      this.ThisPeriod = this.transaction.getCurrency(this.ThisPeriod);
      this.ThisPeriodPercent = this.transaction.getPercent(percentAmount);
      this.CompletedToDate = this.transaction.getCurrency(this.CompletedToDate);

    }
  }



  onFocusPercent() {
    let oldValue = this.AcumulativeComplete;
    this.AcumulativeComplete = this.transaction.getNumberPercent(this.AcumulativeComplete);
    return oldValue;
  }

  onFocusCompletedToDate() {
    let oldValue = this.CompletedToDate;
    this.CompletedToDate = this.transaction.getNumber(this.CompletedToDate);
    return oldValue;
  }

  onFocusPresently() {
    let oldValue = this.PresentlyStored
    this.PresentlyStored = this.transaction.getNumber(this.PresentlyStored);
    return oldValue;
  }

  onFocusThisPeriodPercent() {
    let oldValue = this.ThisPeriodPercent
    this.ThisPeriodPercent = this.transaction.getNumberPercent(this.ThisPeriodPercent);
    return oldValue;
  }

  onFocusThisPeriod() {
    let oldValue = this.ThisPeriod
    this.ThisPeriod = this.transaction.getNumber(this.ThisPeriod);
    return oldValue;
  }

  ToolTip(message: string) {

    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
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

  doToast(str) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  runKeyDown(ev: any) {
    //let regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    let specialKeys: Array<string> = ['Tab', 'Backspace', 'Delete', 'End', 'Home', '-', '.', ',', 'ArrowLeft', 'ArrowRight', 'Left', 'Right'];
    let numberKeys: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(ev.key) !== -1) {
      return;
    }

    // Allow Number keys
    if (numberKeys.indexOf(ev.key) !== -1) {
      return;
    }

    ev.preventDefault();
  }

  showConfirmSage300() {
		const confirm = this.alertCtrl.create({
			title: 'Warning',
			message: this.BILL_WARNING_SAGE300,
			buttons: [
				{
					text: 'Ok',
					handler: () => {
						
					}
				}
			],
			enableBackdropDismiss: false
		});
		confirm.present();
	}

}
