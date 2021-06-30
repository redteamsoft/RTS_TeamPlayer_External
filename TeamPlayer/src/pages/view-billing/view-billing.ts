import { Component, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  Platform,
  LoadingController,
  ToastController,
  AlertController,
  ModalController,
  Modal,
  ModalOptions,
  FabContainer,
  Content,
} from "ionic-angular";
import { FileChooser } from "@ionic-native/file-chooser";
//import { IOSFilePicker } from '@ionic-native/file-picker';
import { TranslateService } from "@ngx-translate/core";
import {
  Transaction,
  User,
  Customer,
  Project,
  Constant,
} from "../../providers";
import { Item } from "../../models/item";
import { File } from "@ionic-native/file/ngx";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-view-billing",
  templateUrl: "view-billing.html",
})
export class ViewBillingPage {
  currentItems: Item[];
  attachItems: Item[];
  item: any;
  itemdetail: any;
  viewrfq: any;
  FileURI: any;
  size: any;
  ItemsPT: Item[];
  ItemsTax: Item[];
  ItemsFormat: Item[];
  ItemsRemitTo: Item[];
  ItemsProgress: Item[];
  ItemsRetainage: Item[];
  public ContentDisabled: boolean = false;
  public PremiumContent: boolean = false;
  public Lines: any;
  public Commitment: any;
  public billForm: FormGroup;
  TaxAmount: any;
  ThisPeriodBilling: any;
  TotalPriorBilling: any;
  NetAmountDue: any;
  TaxRate: any;
  TaxValueRate: any;
  RetainageRate: any;
  TaxVenueName: any;
  VATVenueName: any;
  TotalContractValue: any;
  TotalCompletedStored: any;
  PriorRetainage: any;
  BILL_WARNING_TAXES: any;
  BILL_WARNING_BILL_ZERO: any;
  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;
  today: number = Date.now();
  validate: any;
  AttachmentName: any;
  BoTypeCanadianTaxability: any;
  BoTypeTaxability: any;
  BoTypeRetainage: any;
  showTools: boolean = false;
  billFilters: Item[];
  filterModel: any;
  VendorCertification: any;
  isNotaryCertification: any;
  NotaryCertification: any;
  isArchitectCertification: any;
  ArchitectCertification: any;
  MultipleCC: boolean = false;

  constructor(
    public user: User,
    public customer: Customer,
    public project: Project,
    public constant: Constant,
    public file: File,
    private modal: ModalController,
    public plt: Platform,
    //public filePicker: IOSFilePicker,
    public fileChooser: FileChooser,
    public navCtrl: NavController,
    public transaction: Transaction,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    private fb: FormBuilder,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public element: ElementRef
  ) {
    this.ContentDisabled = this.user._ContentDisabled;
    this.PremiumContent = this.user._Product == 8 ? true : false;
    this.TaxRate = Number(this.transaction._taxvenuevalue) / 100;
    this.TaxValueRate = Number(this.transaction._vatvenuevalue) / 100;
    this.RetainageRate = Number(this.transaction._retainagevalue) / 100;
    this.ThisPeriodBilling = 0.0;
    this.TotalPriorBilling = 0.0;
    this.NetAmountDue = 0.0;
    this.TotalContractValue = 0.0;
    this.TotalCompletedStored = 0.0;
    this.PriorRetainage = 0.0;
    this.attachItems = [];

    this.ItemsFormat = [
      {
        id: 1,
        name: "AIA-Style G702/703-1992",
      },
    ];

    this.ItemsRemitTo = [
      {
        id: this.user._usercompanyid,
        name: this.user._companyname,
      },
    ];

    this.filterModel = "all";
    this.billFilters = [
      { value: "all", text: "All" },
      { value: "disputed", text: "Disputed" },
      { value: "presently", text: "Presently Stored" },
      { value: "under", text: "Under 100% Billed" },
    ];

    this.validate = navParams.get("validate");

    this.translate.get(["BILL_WARNING_TAXES"]).subscribe((value) => {
      this.BILL_WARNING_TAXES = value.BILL_WARNING_TAXES;
    });

    this.translate.get(["BILL_WARNING_BILL_ZERO"]).subscribe((value) => {
      this.BILL_WARNING_BILL_ZERO = value.BILL_WARNING_BILL_ZERO;
    });

    this.translate.get(["LOADING_MESSAGE"]).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
    });

    this.translate.get(["CONNECTION_ERROR"]).subscribe((value) => {
      this.CONNECTION_ERROR = value.CONNECTION_ERROR;
    });
  }

  ionViewWillEnter() {}

  openModalHelp() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
    };

    const myModalData = "";
    let i = 0;
    const myModal: Modal = this.modal.create(
      "ModalPageHelpCenter",
      { data: myModalData, line: i },
      myModalOptions
    );
    myModal.present();
  }

  ngOnInit() {
    // we will initialize our form here
    this.billForm = this.fb.group({
      transaction: this.transaction._transactionid,
      commitment: this.transaction._charsourceid,
      billNumber: [
        "",
        Validators.compose([Validators.maxLength(20), Validators.required]),
      ],
      billDate: ["", Validators.compose([Validators.required])],
      billThroughDate: ["", Validators.compose([Validators.required])],
      billFormat: [],
      billRemitTo: [],
      billFilter: [],
      billCareOf: ["", Validators.compose([Validators.maxLength(100)])],
      billDescription: ["", Validators.compose([Validators.maxLength(1000)])],
      billLines: this.fb.array([]),
      billTotalContractValue: [],
      billTotalPriorBilling: [],
      billThisPeriodBilling: [],
      billTotalCompletedStored: [],
      billPriorRetainage: [],
      billTotalRetainage: [],
      billTotalRetainagePercent: [],
      billCurrentRetainage: 0,
      billCurrentRetainageStatus: true,
      billTaxName: [],
      billTax: 0,
      billValueTaxName: [],
      billValueTax: 0,
      billNetAmountDue: [],
      user: this.user._userid,
      billStatus: [],
      projectNumber: this.project._projectnumber,
      projectScope: this.project._projectscope,
      billFilename: [""],
      dbname: this.transaction._dbname,
      billID: [],
      DisputedRetainage: [],
      DisputedTax: [],
      DisputedVAT: [],
      billTerms: false,
      billTermsContent: [""],
    });

    let loading = this.loadingCtrl.create({
      spinner: "hide",
      content:
        `<div class="spinner-loading"> 
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				</div>` + this.LOADING_MESSAGE,
    });
    this.loadingControl("start", loading);

    let seqBill = this.transaction.BillDetails();

    seqBill.subscribe((res: any) => {
      let item = res[0][0];
      this.Lines = res[1];
      
      var uniqueArray = this.transaction.removeDuplicates(this.Lines, "CostCode_tp");			
      if(uniqueArray.length > 1){
        this.MultipleCC = true;
      }

      this.billForm.get("billNumber").setValue(item.InvoiceNumber_tp);
      this.billForm.get("billDate").setValue(item.BillDate_tp);
      this.billForm.get("billThroughDate").setValue(item.ThroughDate_tp);
      this.billForm.get("billCareOf").setValue(item.CareOf_tp);
      this.billForm.get("billDescription").setValue(item.Notes_tp);
      this.billForm.get("billTaxName").setValue(item.TaxVenueName_tp);
      this.billForm
        .get("billTax")
        .setValue(this.transaction.getCurrency(item.TaxVenueAmount_tp));
      this.billForm.get("billValueTaxName").setValue(item.VATVenueName_tp);
      this.billForm
        .get("billValueTax")
        .setValue(this.transaction.getCurrency(item.VATVenueAmount_tp));
      this.billForm
        .get("billThisPeriodBilling")
        .setValue(item.ThisPeriodBilling_tp);
      this.billForm
        .get("billTotalContractValue")
        .setValue(item.TotalContractValue_tp);
      this.billForm
        .get("billTotalPriorBilling")
        .setValue(item.TotalPriorBilling_tp);
      this.billForm
        .get("billTotalCompletedStored")
        .setValue(item.TotalCompletedStored_tp);
      this.billForm.get("billPriorRetainage").setValue(item.PriorRetainage_tp);
      this.billForm.get("billTotalRetainage").setValue(item.TotalRetainage_tp);
      this.billForm
        .get("billTotalRetainagePercent")
        .setValue(item.TotalRetainagePercent_tp);
      this.billForm
        .get("billCurrentRetainage")
        .setValue(this.transaction.getCurrency(item.CurrentRetainage_tp));
      this.billForm.get("billNetAmountDue").setValue(item.NetAmountDue_tp);
      this.billForm.get("billStatus").setValue(item.Status_tp);
      this.billForm.get("billID").setValue(item.PK_TransactionDetailId_tp);
      this.billForm
        .get("DisputedRetainage")
        .setValue(item.FK_DisputedRetainage_tp);
      this.billForm.get("DisputedTax").setValue(item.FK_DisputedTax_tp);
      this.billForm.get("DisputedVAT").setValue(item.FK_DisputedVAT_tp);

      this.TaxVenueName = item.TaxVenueName_tp;
      this.VATVenueName = item.VATVenueName_tp;
      this.ThisPeriodBilling = item.ThisPeriodBilling_tp;
      this.TotalPriorBilling = item.TotalPriorBilling_tp;
      this.NetAmountDue = item.NetAmountDue_tp;
      this.TotalContractValue = item.TotalContractValue_tp;
      this.TotalCompletedStored = item.TotalCompletedStored_tp;
      this.PriorRetainage = item.PriorRetainage_tp;
      this.AttachmentName = item.AttachmentName_tp;
      this.BoTypeCanadianTaxability = item.rtBoTypeCanadianTaxability_tp
        ? item.rtBoTypeCanadianTaxability_tp.toUpperCase()
        : "";
      this.BoTypeTaxability = item.rtBoTypeTaxability_tp
        ? item.rtBoTypeTaxability_tp.toUpperCase()
        : "";
      this.BoTypeRetainage = item.rtBoTypeRetainage_tp
        ? item.rtBoTypeRetainage_tp.toUpperCase()
        : "";

      this.billForm.get("billTerms").setValue(item.TermsConditions_tp == 1 ? true: false);
      this.VendorCertification = item.TermsConditionsContent_tp;

      let seqBillAttachments = this.transaction.BillAttachments();

      seqBillAttachments.subscribe((resp: any) => {
        this.attachItems = resp[0];
      }),
        (err) => {
          this.doToast(this.CONNECTION_ERROR);
          this.loadingControl("dismiss", loading);
        };

      this.setBillLines();
      this.loadingControl("dismiss", loading);
    }),
      (err) => {
        this.doToast(this.CONNECTION_ERROR);
        this.loadingControl("dismiss", loading);
      };
  }

  setBillLines() {
    let control = <FormArray>this.billForm.controls.billLines;
    this.Lines.forEach((line, index: number) => {
      control.push(this.createItem(line, index));
    });
  }

  openAttach(item) {
    let openview;
    openview =
      this.constant.urlTPUploads + item.uploadfolder + "/" + item.filename;

    window.open(encodeURI(openview), "_system", "location=yes");
  }

  createItem(line, index: number): FormGroup {
    //console.log(this.decimalPipe.transform(line.ChangeInProgress_tp, '1.2-2'))
    return this.fb.group({
      rowNumber: index,
      BOLineID: line.rtBuyoutLineId_tp,
      TO_Mod: line.Scope_tp,
      boLineCstcde: line.CostCode_tp,
      PrtTitle: line.Description_tp,
      Taxable: line.IsTaxable_tp,
      Open: 0,
      Prior: this.transaction.getCurrency(line.Prior_tp),
      UnitCost: line.UnitCost_tp,
      CompletedToDate: line.CompletedToDate_tp,
      PresentlyStored: line.PresentlyStored_tp,
      CompletedStored: line.CompletedStored_tp,
      ThisPeriod: this.transaction.getCurrency(line.ChangeInProgress_tp),
      AcumulativeComplete: line.AcumulativeComplete_tp,
      CurrentOpen: line.Open_tp,
      ChangeInTax: line.ChangeInTax_tp,
      EnterProgress: line.EnterProgress_tp,
      Status: true,
      DisputedId: line.FK_DisputedId_tp,
    });
  }

  doToast(str) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
      position: "top",
    });
    toast.present();
  }

  loadingControl(band = "", loading) {
    if (band === "start") {
      loading.present();
    } else {
      loading.dismiss();
    }
  }

  onClose() {
    this.navCtrl.pop();
  }

  openView() {
    let openview;
    openview =
      "https://" +
      this.transaction._dbname +
      this.constant.urlRTUploaded +
      "/Disbursements/" +
      this.AttachmentName;

    window.open(encodeURI(openview), "_system", "location=yes");
  }

  adjust() {
    for (let i = 0; i <= this.attachItems.length - 1; i++) {
      const ta = this.element.nativeElement.querySelector(
        "#txtdescription" + i
      );
      //const el = document.querySelector('#txtdescription'+i);
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }

  handleOptions() {
    this.showTools = !this.showTools;
  }

  closeOptions(fab: FabContainer) {
    this.showTools = false;
    if (fab) fab.close();
  }

  scrollBot(content: Content, fab: FabContainer) {
    content.scrollToBottom();
    this.closeOptions(fab);
  }

  scrollTop(content: Content, fab: FabContainer) {
    content.scrollToTop();
    this.closeOptions(fab);
  }

  get filterBill(): any {
    const lines = this.billForm.controls.billLines.controls;
    if (this.filterModel === "disputed") {
      return lines.filter((line: any) => line.value.DisputedId);
    } else if (this.filterModel === "presently") {
      return lines.filter((line: any) => line.value.PresentlyStored > 0);
    } else if (this.filterModel === "under") {
      return lines.filter((line: any) => {
        const totalAmount = line.value.UnitCost;
        const thisPeriod = parseFloat(line.value.ThisPeriod.replace(/,/g, ""));
        const prior = parseFloat(line.value.Prior.replace(/,/g, ""));
        return thisPeriod + prior < totalAmount;
      });
    } else {
      return lines;
    }
  }

  get emptyMessage(): string {
    const option = this.filterModel;
    let message: string = "There are no Items in the Contract to be Billed.";
    if (option === "disputed") {
      message = "There are no Disputed Items in this Bill.";
    } else if (option === "presently") {
      message =
        "There are no Items with Presently Stored amounts in this Bill.";
    } else if (option === "under") {
      message = "There are no items under 100% Billed.";
    }
    return message;
  }

  openModalLineDisputed(line, i) {
    //console.log(line)
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
    };
    //const myModalData = line;

    const myModalData = {
      DisputedId: line.DisputedId.value,
      AmountDisputed: line.ThisPeriod.value,
      Description: line.PrtTitle.value,
    };

    const myModal: Modal = this.modal.create(
      "ModalPageDisputed",
      { data: myModalData, line: i, type: "ScheduleValue" },
      myModalOptions
    );
    myModal.present();
  }

  openModalDisputed(type) {
    //console.log(bill)
    let DisputedId;
    let AmountDisputed;
    switch (type) {
      case "CurrentRetainage":
        DisputedId = this.billForm.get("DisputedRetainage").value;
        AmountDisputed = this.billForm.get("billCurrentRetainage").value;
        break;
      case "Tax":
        DisputedId = this.billForm.get("DisputedTax").value;
        AmountDisputed = this.billForm.get("billTax").value;
        break;
      case "VAT":
        DisputedId = this.billForm.get("DisputedVAT").value;
        AmountDisputed = this.billForm.get("billValueTax").value;
        break;
    }

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
    };

    const myModalData = {
      DisputedId: DisputedId,
      AmountDisputed: AmountDisputed,
      Description: "",
    };

    const myModal: Modal = this.modal.create(
      "ModalPageDisputed",
      { data: myModalData, line: 0, type: type },
      myModalOptions
    );
    myModal.present();
  }

  OpenTermsConditions() {
    //console.log("open Terms");

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
    };

    const myModalData = {
      VendorCertification: this.VendorCertification,
    };

    const myModal: Modal = this.modal.create(
      "ModalsTermsConditionsPage",
      { data: myModalData },
      myModalOptions
    );
    myModal.present();

    myModal.onWillDismiss((data) => {
      //console.log("close Terms");
    });
  }
}
