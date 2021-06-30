import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
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
  selector: 'page-modal-page-retainage',
  templateUrl: 'modal-page-retainage.html',
})
export class ModalPageRetainage {

  CurrentRetainageStatus: any;
  TotalContractValue = 0.00;
  TotalPriorBilling = 0.00;
  ThisPeriodBilling = 0.00;
  TotalCompletedStored = 0.00;
  PriorRetainage = 0.00;
  TotalRetainage: any = 0.00;
  TotalRetainagePercent: any = 0.00;
  CurrentRetainage: any = 0.00;
  RetainageRate = 0.00;
  BILL_RETAINAGE_CONTRACT_VALUE_WARNING: any;
  BILL_RETAINAGE_PRIOR_BILLING_WARNING: any;
  BILL_RETAINAGE_THIS_PERIOD_WARNING: any;
  BILL_RETAINAGE_COMPLETED_STORED_WARNING: any;
  BILL_RETAINAGE_PRIOR_RETAINAGE_WARNING: any;
  BILL_RETAINAGE_TOTAL_RETAINAGE_WARNING: any;
  BILL_RETAINAGE_CURRENT_RETAINAGE_WARNING: any;
  BILL_WARNING_SAGE300: any;
  RetainageReadOnly: boolean = false;

  constructor(
    private navParams: NavParams,
    private view: ViewController,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    public transaction: Transaction,
    public alertCtrl: AlertController) {

      this.translate.get([
        'BILL_RETAINAGE_CONTRACT_VALUE_WARNING',
        'BILL_RETAINAGE_PRIOR_BILLING_WARNING',
        'BILL_RETAINAGE_THIS_PERIOD_WARNING',
        'BILL_RETAINAGE_COMPLETED_STORED_WARNING',
        'BILL_RETAINAGE_PRIOR_RETAINAGE_WARNING',
        'BILL_RETAINAGE_TOTAL_RETAINAGE_WARNING',
        'BILL_RETAINAGE_CURRENT_RETAINAGE_WARNING',
        'BILL_WARNING_SAGE300']).subscribe((value) => {
        
          this.BILL_RETAINAGE_CONTRACT_VALUE_WARNING = value.BILL_RETAINAGE_CONTRACT_VALUE_WARNING;
          this.BILL_RETAINAGE_PRIOR_BILLING_WARNING = value.BILL_RETAINAGE_PRIOR_BILLING_WARNING;
          this.BILL_RETAINAGE_THIS_PERIOD_WARNING = value.BILL_RETAINAGE_THIS_PERIOD_WARNING;
          this.BILL_RETAINAGE_COMPLETED_STORED_WARNING = value.BILL_RETAINAGE_COMPLETED_STORED_WARNING;
          this.BILL_RETAINAGE_PRIOR_RETAINAGE_WARNING = value.BILL_RETAINAGE_PRIOR_RETAINAGE_WARNING;
          this.BILL_RETAINAGE_TOTAL_RETAINAGE_WARNING = value.BILL_RETAINAGE_TOTAL_RETAINAGE_WARNING;
          this.BILL_RETAINAGE_CURRENT_RETAINAGE_WARNING = value.BILL_RETAINAGE_CURRENT_RETAINAGE_WARNING;
          this.BILL_WARNING_SAGE300 = value.BILL_WARNING_SAGE300;

      });
  }

  ionViewWillLoad() {

    const data = this.navParams.get('data');
    console.log(data);
    this.CurrentRetainageStatus = data.CurrentRetainageStatus;

    if (!this.CurrentRetainageStatus) {
      this.TotalContractValue = data.TotalContractValue;
      this.TotalPriorBilling = data.TotalPriorBilling;
      this.ThisPeriodBilling = data.ThisPeriodBilling;
      this.TotalCompletedStored = data.TotalCompletedStored;
      this.PriorRetainage = data.PriorRetainage;
      this.TotalRetainagePercent = this.transaction.getPercent(this.transaction.getNumber(data.RetainageRate));
      this.TotalRetainage = this.transaction.getCurrency(this.transaction.getNumber((Number(data.RetainageRate) * Number(data.TotalCompletedStored)).toFixed(2)));
      this.CurrentRetainage = this.transaction.getCurrency(this.transaction.getNumber((-1 * (Number(this.PriorRetainage) - this.transaction.getNumber(this.TotalRetainage))).toFixed(2)));
    } else {
      this.TotalContractValue = data.TotalContractValue;
      this.TotalPriorBilling = data.TotalPriorBilling;
      this.ThisPeriodBilling = data.ThisPeriodBilling;
      this.TotalCompletedStored = data.TotalCompletedStored;
      this.PriorRetainage = data.PriorRetainage;

      if (data.WarningRetainage == 1) {
        this.TotalRetainagePercent = this.transaction.getPercent(this.transaction.getNumber(data.RetainageRate));
        this.TotalRetainage = this.transaction.getCurrency(this.transaction.getNumber((Number(data.RetainageRate) * Number(data.TotalCompletedStored)).toFixed(2)));
        this.CurrentRetainage = this.transaction.getCurrency(this.transaction.getNumber((-1 * (Number(this.PriorRetainage) - this.transaction.getNumber(this.TotalRetainage))).toFixed(2)));
      } else {
        this.TotalRetainagePercent = this.transaction.getPercent(this.transaction.getNumber(data.TotalRetainagePercent) / 100);
        this.TotalRetainage = this.transaction.getCurrency(this.transaction.getNumber(data.TotalRetainage));        
        this.CurrentRetainage = this.transaction.getCurrency(this.transaction.getNumber(data.CurrentRetainage));
      }
    }

    this.RetainageRate = data.RetainageRate;

    //SAGE 100
    if(data.IsCompanySage100 == 'YES' && data.Alias != ''){      

      let seqOpenCommitment = this.transaction.OpenCommitment(1);

      seqOpenCommitment.subscribe((res: any) => {
        let CurrentOpenCommitment: Number;
        let TotalProgress: any;
        
          TotalProgress = (Number(res[0].TotalChangeInProgress) + Number(this.ThisPeriodBilling)).toFixed(2);
          CurrentOpenCommitment = Number(this.TotalContractValue) - Number(TotalProgress);

          if(CurrentOpenCommitment == 0 && Number(this.ThisPeriodBilling) == 0 && Number(this.PriorRetainage) != 0 ){
            this.RetainageReadOnly = false;
          } else {
            this.RetainageReadOnly = true;
          }
        
      }), (err) => {
        //this.loadingControl('dismiss', loading);
        //this.doToast(this.CONNECTION_ERROR);
      };;

    }

    //SAGE 300
    if(data.IsCompanySage300 == 'YES' && data.Alias != ''){      
      this.showConfirmSage300(data);
    }

  }

  confirmModal() {   

    const data = {
      TotalRetainagePercent: this.transaction.getNumberPercent(this.TotalRetainagePercent),
      TotalRetainage: this.transaction.getNumber(this.TotalRetainage),
      CurrentRetainage: this.transaction.getNumber(this.CurrentRetainage),
      CurrentRetainageStatus: true,
      WarningRetainage: 0
    };
    //this.showConfirm(data);
    this.view.dismiss(data);
  }

  cancelModal() {
    this.view.dismiss();
  }

  showConfirmSage300(data: any) {
		const confirm = this.alertCtrl.create({
			title: 'Warning',
			message: this.BILL_WARNING_SAGE300,
			buttons: [
				{
					text: 'Ok',
					handler: () => {						
            this.ReCalculateSage300(data);
					}
				}
			],
			enableBackdropDismiss: false
		});
		confirm.present();
	}

  ReCalculateSage300(data: any){

      if (!this.CurrentRetainageStatus || this.ThisPeriodBilling != 0) {
        this.ThisPeriodBilling = 0.00;
        this.TotalCompletedStored = Number(data.TotalCompletedStored) - Number(data.ThisPeriodBilling);
        
        this.TotalRetainagePercent = this.transaction.getPercent(this.transaction.getNumber(data.RetainageRate));
        this.TotalRetainage = this.transaction.getCurrency(this.transaction.getNumber((Number(data.RetainageRate) * Number(this.TotalCompletedStored)).toFixed(2)));
        this.CurrentRetainage = this.transaction.getCurrency(this.transaction.getNumber((-1 * (Number(data.PriorRetainage) - this.transaction.getNumber(this.TotalRetainage))).toFixed(2)));
      } 
  }

  onChangeValue(oldValue: any) {
    let newTotalRetainage = this.transaction.getNumber(this.TotalRetainage);
    let oldTotalRetainage = Number(Number(Number(this.TotalCompletedStored)).toFixed(2));

    if (Number(newTotalRetainage) >= Math.min(Number(oldTotalRetainage), 0) && Number(newTotalRetainage) <= Math.max(Number(oldTotalRetainage), 0)) {
      if (Number(this.TotalCompletedStored) != 0) {
        this.TotalRetainagePercent = Number(((this.transaction.getNumber(this.TotalRetainage) / Number(this.TotalCompletedStored)) * 100).toFixed(2));
      } else {
        this.TotalRetainagePercent = 0.00;
      }
      this.TotalRetainagePercent = this.transaction.getPercent(this.TotalRetainagePercent / 100);

      this.CurrentRetainage = this.transaction.getCurrency(-1 * Number((Number(this.PriorRetainage) - this.transaction.getNumber(this.TotalRetainage)).toFixed(2)));
      this.TotalRetainage = this.transaction.getCurrency(this.transaction.getNumber(this.TotalRetainage));
    } else {
      this.TotalRetainage = oldValue;
      this.ToolTip("Retainage amount is invalid!");
    }
  }

  onChangePercent(oldValue: any) {
    if (this.TotalRetainagePercent <= 100) {
      this.TotalRetainage = Number(((this.TotalRetainagePercent / 100) * Number(this.TotalCompletedStored)).toFixed(2));
      this.CurrentRetainage = -1 * Number((Number(this.PriorRetainage) - Number(this.TotalRetainage)).toFixed(2));

      this.TotalRetainage = this.transaction.getCurrency(this.TotalRetainage);
      this.TotalRetainagePercent = this.transaction.getPercent(this.TotalRetainagePercent / 100);
      this.CurrentRetainage = this.transaction.getCurrency(this.CurrentRetainage);
    } else {
      this.TotalRetainagePercent = oldValue;
      this.ToolTip("Retainage percent is invalid!");
    }
  }

  onFocusPercent() {
    let oldValue = this.TotalRetainagePercent;
    this.TotalRetainagePercent = this.transaction.getNumberPercent(this.TotalRetainagePercent);
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


}
