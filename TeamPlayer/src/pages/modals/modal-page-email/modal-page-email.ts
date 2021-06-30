import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, Project, User } from '../../../providers';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-page-email',
  templateUrl: 'modal-page-email.html',
})
export class ModalPageEmail {

  UnitCost = 0;
  CompletedToDate: any;
  PresentlyStored: any;
  CompletedStored = 0;
  PriorBilling = 0;
  ThisPeriod: any;
  AcumulativeComplete: any;
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
  EnterProgress: any;
  TotalBills: any;
  PreviousCompletedToDate: number;
  PreviousPresentlyStored: number;
  public emailForm: FormGroup;
  item: any;
  public JobLocation: any;
  public LocationAddress: any;
  tags: any;

  constructor(
    private navParams: NavParams,
    private view: ViewController,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public transaction: Transaction,
    public project: Project,
    public user: User,
    private fb: FormBuilder) {
  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    this.JobLocation = this.navParams.get('JobLocation');
    this.LocationAddress = this.navParams.get('LocationAddress');

    this.translate.get(['BILL_LINE_CONTRACT_VALUE_WARNING']).subscribe((value) => {
      this.BILL_LINE_CONTRACT_VALUE_WARNING = value.BILL_LINE_CONTRACT_VALUE_WARNING;
    });

    this.translate.get(['BILL_LINE_PRESENTLY_WARNING']).subscribe((value) => {
      this.BILL_LINE_PRESENTLY_WARNING = value.BILL_LINE_PRESENTLY_WARNING;
    });

    this.translate.get(['BILL_LINE_COMPLETED_DATE_WARNING']).subscribe((value) => {
      this.BILL_LINE_COMPLETED_DATE_WARNING = value.BILL_LINE_COMPLETED_DATE_WARNING;
    });

    this.translate.get(['BILL_LINE_PROGRESS_PERCENT_WARNING']).subscribe((value) => {
      this.BILL_LINE_PROGRESS_PERCENT_WARNING = value.BILL_LINE_PROGRESS_PERCENT_WARNING;
    });

    this.translate.get(['BILL_LINE_COMPLETED_STORED_WARNING']).subscribe((value) => {
      this.BILL_LINE_COMPLETED_STORED_WARNING = value.BILL_LINE_COMPLETED_STORED_WARNING;
    });

    this.translate.get(['BILL_LINE_LESS_PRIOR_WARNING']).subscribe((value) => {
      this.BILL_LINE_LESS_PRIOR_WARNING = value.BILL_LINE_LESS_PRIOR_WARNING;
    });

    this.translate.get(['BILL_LINE_THIS_PERIOD_WARNING']).subscribe((value) => {
      this.BILL_LINE_THIS_PERIOD_WARNING = value.BILL_LINE_THIS_PERIOD_WARNING;
    });

    this.translate.get(['BILL_LINE_OPEN_WARNING']).subscribe((value) => {
      this.BILL_LINE_OPEN_WARNING = value.BILL_LINE_OPEN_WARNING;
    });

    this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
    });

    this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
      this.CONNECTION_ERROR = value.CONNECTION_ERROR;
    });

    this.transaction._transactiondetailid = data.TransactionDetailId;

  }

  ngOnInit() {
    //this.tags = ['Ionic', 'Angular', 'TypeScript'];
    this.tags = [];
    // we will initialize our form here
    this.emailForm = this.fb.group({
      emailSubject: ['', Validators.compose([Validators.maxLength(150), Validators.required])],
      emailFrom: ['', Validators.compose([Validators.maxLength(100), Validators.required, Validators.email])],
      emailTo: [this.tags],
      emailMessage: ['', Validators.compose([Validators.maxLength(1000)])],
      filename: [''],
      nameFrom: ['', Validators.compose([Validators.maxLength(150)])],
      transactionid: [],
      emailBody: ['']
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

    let seqBill = this.transaction.BillDetails();

    seqBill.subscribe((res: any) => {
      this.loadingControl('dismiss', loading);

      this.item = res[0][0];
      let Subject = "Invoice " + this.item.InvoiceNumber_tp + " " + this.truncate(this.item.Notes_tp, 20, false) + "(" + this.project._rtProjNum + "-" + this.truncate(this.project._projectname, 40, false) + ")";
      this.emailForm.get('emailSubject').setValue(Subject);
      this.emailForm.get('emailFrom').setValue(this.user._useremail);

    }), (err) => {
      this.doToast(this.CONNECTION_ERROR);
      this.loadingControl('dismiss', loading);
    }

  }

  confirmModal() {
    this.emailForm.get('filename').setValue(this.item.AttachmentName_tp);
    this.emailForm.get('transactionid').setValue(this.transaction._transactionid);
    this.emailForm.get('nameFrom').setValue(this.user._userfirstname + ' ' + this.user._userlastname);
    let arrayEmailTo = this.emailForm.get('emailTo').value;
    if (arrayEmailTo.length == 0) {
      this.doToast("Please, enter an email ");
      return false;
    }

    let seqBill = this.transaction.EmailBillingTemplate();

    seqBill.subscribe((res: any) => {

      //console.log(res);
      let emailTemplate = res;

      if (this.emailForm.get('emailMessage').value != "") {
        emailTemplate = emailTemplate.replace('txt_Optional_Body_Author', this.user._userfirstname + ' ' + this.user._userlastname);
        emailTemplate = emailTemplate.replace('txt_Optional_Body', this.emailForm.get('emailMessage').value);
      } else {
        emailTemplate = emailTemplate.replace('txt_optional_description', "none");
      }
      emailTemplate = emailTemplate.replace(new RegExp('txt_company_name', 'g'), this.user._companyname);
      emailTemplate = emailTemplate.replace('txt_project_number', this.project._rtProjNum);
      emailTemplate = emailTemplate.replace('txt_project_name', this.project._projectname);
      emailTemplate = emailTemplate.replace('txt_project_location', this.JobLocation);
      emailTemplate = emailTemplate.replace('txt_project_locationaddress', this.LocationAddress);
      emailTemplate = emailTemplate.replace('txt_project_user', this.user._userfirstname + ' ' + this.user._userlastname);
      emailTemplate = emailTemplate.replace('txt_invoice_number', this.item.InvoiceNumber_tp);

      this.emailForm.get('emailBody').setValue(emailTemplate);

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

      let seqAux = this.transaction.BillingNotification(this.emailForm.value);

      seqAux.subscribe((res: any) => {
        this.loadingControl('dismiss', loading);
        const confirmSent = this.alertCtrl.create({
          title: "Success!",
          message: "Your email has been sent successfully.",
          buttons: [
            {
              text: "OK",
              handler: () => {
                this.view.dismiss();
              }
            }
          ]
        });
        confirmSent.present();

      }), (err) => {
        this.loadingControl('dismiss', loading);
        this.doToast(this.CONNECTION_ERROR);
      }

    }), (err) => {
      this.doToast(this.CONNECTION_ERROR);
      //this.loadingControl('dismiss', loading);
    }

  }

  cancelModal() {
    this.view.dismiss();
  }

  loadingControl(band = '', loading) {
    if (band === 'start') {
      loading.present();
    } else {
      loading.dismiss();
    }
  }

  truncate(value: string, limit = 25, completeWords = true, ellipsis = '…') {
    let lastindex = limit;
    if (completeWords) {
      lastindex = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, lastindex)}${ellipsis}`;
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
