import { Component, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  FabContainer,
  ModalController,
  Modal,
  ModalOptions,
  Platform,
  PopoverController,
} from "ionic-angular";
import { FileChooser } from "@ionic-native/file-chooser";
//import { IOSFilePicker } from '@ionic-native/file-picker';
import {
  LoadingController,
  ToastController,
  AlertController,
} from "ionic-angular";
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
import { PopoverContractComponent } from "../../components/popover-contract/popover-contract";

@IonicPage()
@Component({
  selector: "page-commitment-detail",
  templateUrl: "commitment-detail.html",
})
export class CommitmentDetailPage {
  currentItems: Item[];
  item: any;
  itemdetail: any;
  viewrfq: any;
  FileURI: any;
  size: any;

  public ContentDisabled: boolean = false;
  public ViewPremiumContent: boolean = false;
  public moredetails: boolean = false;
  public olddata: boolean = false;
  public RequestTime: String;
  public JobLocation: String;
  public LocationAddress: String;
  public Description: String;
  public Constraints: String;
  public Instructions: String;
  public FacilityID: String;
  public WoStatus: String;
  public VendorID: String;
  public UserID: String;
  public stylepadding: String;
  public latedatesdif: boolean = false;
  public FileName: String;
  public CommitmentDate: String;
  public CommitmentScope: String;
  public CommitmentTerms: String;
  public CommitmentRetainage: String;
  public CommitmentDeliveryDate: String;
  public CommitmentStartDate: String;
  public CommitmentFinishDate: String;
  public CommitmentOrderTotal: String;
  public CommitmentSubTotal: String;
  public CommitmentTaxes: String;
  public CommitmentTotalWithTax: String;
  public CommitmentCanadianTaxes: String;
  public CommitmentTypeBterms: String;
  public CommitmentTypeRetainage: String;
  public CommitmentTypeStartDate: String;
  public CommitmentTypeDeliveryDate: String;
  public CommitmentTypeFinishDate: String;
  public aData: any;
  public CommitmentTypeCanadianTaxability: String;
  public CommitmentTypeTaxability: String;
  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;
  PRODUCT_AND_SERVICE_AMOUNT: any;
  btnAccess: any;
  btnAccessBilling: any;
  MultipleCC: boolean = false;

  constructor(
    public user: User,
    public customer: Customer,
    public project: Project,
    public constant: Constant,
    public file: File,
    //public filePicker: IOSFilePicker,
    public fileChooser: FileChooser,
    public navCtrl: NavController,
    public transaction: Transaction,
    private modal: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public platform: Platform,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public element: ElementRef
  ) {
    if (this.platform.is("core") || this.platform.is("mobileweb")) {
      this.user.ValidateToken().subscribe(
        (resp) => {
          if (resp[0].Sessions == 0) {
            //console.log("Token invalid");
            this.navCtrl.setRoot("LoginPage");
          } else {
            //console.log(resp[0].Sessions)
          }
        },
        (err) => {
          this.navCtrl.setRoot("LoginPage");
        }
      );
    }

    this.btnAccess = this.user.validateUserPermissions("Contracts");
    this.btnAccessBilling = this.user.validateUserPermissions("Billing");
    if (this.btnAccess == "NoAccess") {
      this.navCtrl.setRoot("ErrorUnauthorizedPage");
    }

    this.stylepadding = "";
    this.ContentDisabled = this.user._ContentDisabled;
    this.ViewPremiumContent = this.user._ViewPremiumContent;

    if (this.transaction._olddata == 1) this.olddata = true;

    this.translate.get(["LOADING_MESSAGE"]).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
    });

    this.translate.get(["CONNECTION_ERROR"]).subscribe((value) => {
      this.CONNECTION_ERROR = value.CONNECTION_ERROR;
    });

    this.translate.get(["PRODUCT_AND_SERVICE_AMOUNT"]).subscribe((value) => {
      this.PRODUCT_AND_SERVICE_AMOUNT =
        value.PRODUCT_AND_SERVICE_AMOUNT.replace(
          "$",
          this.project._rtMonetarySymbol
        );
    });
  }

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

  ionViewWillEnter() {
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
    let element = document.getElementById("floatmenu");
    if (this.translate.currentLang == "es")
      element.setAttribute(
        "style",
        "margin-left: -122px;align-items: flex-end;"
      );

    this.loadingControl("dismiss", loading);

    if (this.user._refreshpage == "true") {
    }

    if (this.navCtrl.getPrevious().name == "EnterBillingPage") {
      console.log("Remove EnterBillingPage");
      this.navCtrl.remove(this.navCtrl.getPrevious().index);
      //this.navCtrl.setRoot("CommitmentDetailPage");
    }
  }

  activeMenuBK(fab: FabContainer) {
    let element = document.getElementById("bkmenu");
    element.style.display == "block"
      ? (element.style.display = "none")
      : (element.style.display = "block");
    if (fab) fab.close();
  }

  fabaction(socialNet: string, fab: FabContainer, item: Item) {
    let nextItem = "";

    switch (socialNet) {
      case "moredetails": {
        if (!this.ContentDisabled) {
          this.openDetails();
        }
        break;
      }
      case "planroom": {
        if (!this.ContentDisabled) {
          this.openPlanRoom();
        }
        break;
      }
      case "viewcommitment": {
        if (this.ViewPremiumContent) {
          nextItem = "ListContractDocumentsPage";
          this.navCtrl.push(nextItem);
        }
        break;
      }
      case "billing": {
        if (!this.olddata) {
          nextItem = "ListBillingPage";
          //this.transaction._transactionStorage(item)
          this.navCtrl.push(nextItem);
        }
        break;
      }
      case "enter_billing": {
        if (!this.olddata && !this.ContentDisabled) {
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

          if (this.transaction._status == "Closed") {
            this.loadingControl("dismiss", loading);
            this.translate
              .get(["CONTRACT_WARNING_CLOSED_STATUS"])
              .subscribe((value) => {
                this.doToast(value.CONTRACT_WARNING_CLOSED_STATUS);
              });
          } else {
            let seq = this.transaction.BillValidate();

            seq.subscribe((res: any) => {
              this.loadingControl("dismiss", loading);
              let BillsInDraft = res[0][0].BillsInDraft;
              if (BillsInDraft > 0) {
                this.showValidate(
                  "There is already a Draft Bill for this Contract."
                );
              } else {
                nextItem = "EnterBillingPage";
                this.navCtrl.push(nextItem, {
                  validate: "true",
                });
              }
            }),
              (err) => {
                this.doToast(this.CONNECTION_ERROR);
                this.loadingControl("dismiss", loading);
              };
          }
        }
        break;
      }
      case "credentials": {
        if (!this.ContentDisabled) {
          nextItem = "ListCredentialsPage";
          this.navCtrl.push(nextItem);
        }
        break;
      }
      case "waivers": {
        if (!this.ContentDisabled) {
          nextItem = "ListWaiversPage";
          this.navCtrl.push(nextItem);
        }
        break;
      }
      default: {
        break;
      }
    }
    fab.close();
  }

  openDetails() {
    let element = document.getElementById("firstcontainer");

    if (this.moredetails) {
      this.moredetails = false;
      if (this.transaction._transactiontype == "RFQ")
        element.setAttribute("style", "padding: 10px 12px 30px 12px;");
    } else {
      if (this.transaction._transactiontype == "RFQ")
        element.setAttribute("style", "padding: 10px 12px 0px 12px;");

      if (!this.itemdetail) {
        let seq = this.transaction.CommitmentDetails(
          this.transaction._charsourceid,
          this.transaction._transactionnumber,
          this.transaction._dbname
        );

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

        seq.subscribe((res: any) => {
          //console.log(res);
          this.aData = res[1];
          this.itemdetail = res[0][0];

          var uniqueArray = this.transaction.removeDuplicates(
            this.aData,
            "boLineCstcde"
          );
          if (uniqueArray.length > 1) {
            this.MultipleCC = true;
          }
          this.CommitmentDate = this.itemdetail.OrderDate;
          this.JobLocation = this.itemdetail.WorkLocation;
          if (this.itemdetail.LocationAddress == null) {
            this.itemdetail.LocationAddress = "";
          }

          if (this.itemdetail.LocationCitynme == null) {
            this.itemdetail.LocationCitynme = "";
          }

          if (this.itemdetail.LocationState == null) {
            this.itemdetail.LocationState = "";
          }

          if (this.itemdetail.LocationZipcde == null) {
            this.itemdetail.LocationZipcde = "";
          }

          if (this.itemdetail.LocationAddress.trim() != "") {
            this.LocationAddress =
              this.itemdetail.LocationAddress.trim() +
              ", " +
              this.itemdetail.LocationCitynme.trim() +
              ", " +
              this.itemdetail.LocationState.trim() +
              " " +
              this.itemdetail.LocationZipcde.trim();
          } else {
            if (this.itemdetail.LocationCitynme.trim() != "") {
              this.LocationAddress =
                this.itemdetail.LocationCitynme.trim() +
                ", " +
                this.itemdetail.LocationState.trim() +
                " " +
                this.itemdetail.LocationZipcde.trim();
            } else {
              this.LocationAddress =
                this.itemdetail.LocationState.trim() +
                " " +
                this.itemdetail.LocationZipcde.trim();
            }
          }

          var scope = this.itemdetail.WorkorderMod.trim();

          if (scope == "00") {
            this.CommitmentScope = "Original";
          } else {
            this.CommitmentScope =
              "C0 " +
              this.itemdetail.ScopeNum +
              " - " +
              this.itemdetail.ProjectTitle;
          }

          this.CommitmentTerms = this.itemdetail.TermsDescription;
          this.CommitmentRetainage = this.itemdetail.BORetainage;
          this.CommitmentDeliveryDate = this.itemdetail.BODeliveryDate;
          this.CommitmentStartDate = this.itemdetail.BOStartDate;
          this.CommitmentFinishDate = this.itemdetail.BOFinishDate;

          /* SETTING BUYOUT TYPE */
          this.CommitmentTypeBterms =
            this.itemdetail.BoTypeBterms.toUpperCase();
          this.CommitmentTypeRetainage =
            this.itemdetail.BoTypeRetainageForm.toUpperCase();
          this.CommitmentTypeDeliveryDate =
            this.itemdetail.BoTypeDeliveryDateForm.toUpperCase();
          this.CommitmentTypeStartDate =
            this.itemdetail.BoTypeStartDateForm.toUpperCase();
          this.CommitmentTypeFinishDate =
            this.itemdetail.BoTypeFinishDateForm.toUpperCase();
          this.CommitmentTypeTaxability =
            this.itemdetail.BoTypeTaxability.toUpperCase();
          this.CommitmentTypeCanadianTaxability =
            this.itemdetail.BoTypeCanadianTaxability == null
              ? "NO"
              : this.itemdetail.BoTypeCanadianTaxability.toUpperCase();

          this.CommitmentOrderTotal = this.aData[0].OrderTotal;
          this.CommitmentSubTotal = this.aData[0].SubOrderTotal;
          this.CommitmentTaxes = this.aData[0].Taxes;
          this.CommitmentCanadianTaxes = this.aData[0].CanadianTaxes;
          this.CommitmentTotalWithTax = this.aData[0].TotalWithTax;

          this.loadingControl("dismiss", loading);
          this.moredetails = true;
        }),
          (err) => {
            this.doToast(this.CONNECTION_ERROR);
            this.loadingControl("dismiss", loading);
          };
      } else {
        this.moredetails = true;
      }
    }
  }

  openPlanRoom() {
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
    let seq = this.transaction.ViewPlanroom();

    seq.subscribe((res: any) => {
      window.open(
        encodeURI(
          this.constant.urlEnviroment +
            "/rts/app/asp/PlanroomFromSource.asp?WorkorderID=" +
            this.project._projectnumber +
            "&client=" +
            this.transaction._dbname +
            "&userid=" +
            res[0].UserID +
            "&Source=Buyout&SourceID=" +
            this.transaction._charsourceid
        ),
        "_system",
        "location=yes"
      );
      this.loadingControl("dismiss", loading);
    }),
      (err) => {
        this.doToast(this.CONNECTION_ERROR);
        this.loadingControl("dismiss", loading);
      };
  }

  ViewCommitment() {
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
    let seq = this.transaction.ViewCommitment();

    seq.subscribe((res: any) => {
      window.open(encodeURI(res.url), "_system", "location=yes");
      this.loadingControl("dismiss", loading);
    }),
      (err) => {
        this.doToast(this.CONNECTION_ERROR);
        this.loadingControl("dismiss", loading);
      };
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

  showValidate(message: string) {
    const confirm = this.alertCtrl.create({
      title: "Warning!",
      message: message,
      buttons: [
        {
          text: "Ok",
        },
      ],
    });
    confirm.present();
  }

  MenuNavegation(myEvent) {
    const ta = this.element.nativeElement.querySelector("#navegations");
    //console.log(ta)
    ta.classList.add("btn-active-more");    

    //console.log('ProjectMenuPopover2')
    const popover = this.popoverCtrl.create(
      PopoverContractComponent      
    );

    popover.present({ ev: myEvent });

    popover.onDidDismiss((popoverData) => {
      //console.log(popoverData);
      let currentIndex = this.navCtrl.getActive().index;
      if (popoverData != null) {
        switch (popoverData.event) {
          case "Projects":
            //console.log(popoverData);
            this.navCtrl.push("ListProjectPage").then(() => {
              this.navCtrl.remove(currentIndex);
            });
            break;
          case "Transactions":
            //console.log(popoverData);
            this.navCtrl.push("ListTransactionPage").then(() => {
              this.navCtrl.remove(currentIndex);
            });
            break;
        }
      } else {
        ta.classList.remove("btn-active-more");
      }
    });
  }

  LnkNavegation(myEvent) {
    let currentIndex = this.navCtrl.getActive().index;

    switch (myEvent) {
      case "Customers":
        //console.log(popoverData);
        this.navCtrl.push("ListCustomerPage").then(() => {
          this.navCtrl.remove(currentIndex);
        });
        break;
    }
  }
}
