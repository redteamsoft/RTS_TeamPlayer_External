import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Items } from '../../providers';
import { Platform, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, User, Customer, Project, Constant } from '../../providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
	selector: 'page-rfq-detail',
	templateUrl: 'rfq-detail.html'
})
export class RFQDetailPage {
	currentItems: Item[];
	item: any;
	itemdetail: any;
	viewrfq: any;
	FileURI: any;
	size: any;
	btnAccess: any;
	btnAccessQuote: any;

	public ContentDisabled: boolean = false
	public ViewPremiumContent: boolean = false
	public submitted: boolean = false
	public moredetails: boolean = false
	public QuoteAmount: any
	public RequestTime: String
	public RFQFileDescription: String
	public RFQFileName: String
	public QuoteFileDescription: String
	public QuoteFileName: String
	public JobLocation: String
	public LocationAddress: String
	public Description: String
	public Constraints: String
	public Instructions: String
	public FacilityID: String
	public RFQStatus: String
	public WoStatus: String
	public VendorID: String
	public UserID: String
	public stylepadding: String
	public latedatesdif: boolean = false;
	public FileName: String
	constructor(public user: User,
		public customer: Customer,
		public project: Project,
		public constant: Constant,
		public plt: Platform,
		public navCtrl: NavController,
		navParams: NavParams,
		items: Items,
		public transaction: Transaction,
		private modal: ModalController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public platform: Platform,
		public translate: TranslateService) {				

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

		if(this.transaction._transactiontype == "RFQ") {
			this.btnAccess = this.user.validateUserPermissions("RFQs");
			this.btnAccessQuote = this.user.validateUserPermissions("Quotes");

			if(this.btnAccess == "NoAccess"){				
				this.navCtrl.setRoot('ErrorUnauthorizedPage');
			}

		} else if(this.transaction._transactiontype == "Quote") {
			this.btnAccessQuote = this.user.validateUserPermissions("Quotes");

			if(this.btnAccessQuote == "NoAccess"){				
				this.navCtrl.setRoot('ErrorUnauthorizedPage');
			}
		}
		

		this.stylepadding = "";
		this.ContentDisabled = this.user._ContentDisabled;
		this.ViewPremiumContent = this.user._ViewPremiumContent;

		if (this.transaction._status == 'Submitted' || this.transaction._status == 'Accepted') {
			this.submitted = true;
			let strdif = this.transaction._datesdif

			if (strdif.indexOf("late") >= 0)
				this.latedatesdif = true

			this.QuoteAmount = this.transaction._amountsubmitted ? this.transaction._amountsubmitted : 0;
		}

		if (!this.ContentDisabled) {

			let seq = this.transaction.ViewRFQ();

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
					this.viewrfq = res;
					this.FacilityID = this.viewrfq[0].FacilityID;
					this.WoStatus = this.viewrfq[0].WoStatus;
					this.VendorID = this.viewrfq[0].VendorID;
					this.UserID = this.viewrfq[0].UserID;
					this.RFQStatus = this.viewrfq[0].RFQStatus;

					let element = document.getElementById('floatmenu')
					if (this.translate.currentLang == 'es')
						element.setAttribute("style", "margin-left: -122px;align-items: flex-end;");

					this.loadingControl('dismiss', loading)
				}), (err) => {
					this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
						this.doToast(value.CONNECTION_ERROR);
					})
				}
			})
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

	toFixedTrunc(value, n) {
		const v = value.toString().split('.');
		if (n <= 0) return v[0];
		let f = v[1] || '';
		if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
		while (f.length < n) f += '0';
		return `${v[0]}.${f}`
	}


	ionViewWillEnter() {

		if (this.user._refreshpage == "true") {

			this.user._refreshpage = "false";
			this.transaction._status = 'Submitted';
			this.transaction._transactiontype = 'Quote';
			this.submitted = true;
			/*let element = document.getElementById('floatmenu')
			element.setAttribute("style", "margin-left: -80px;align-items: flex-end;");
			*/
			this.QuoteAmount = this.transaction._amountsubmitted ? this.transaction._amountsubmitted : 0;

			let now = new Date();
			let day = ("0" + now.getDate()).slice(-2);
			let month = ("0" + (now.getMonth() + 1)).slice(-2);
			let today = (month) + "/" + (day) + "/" + now.getFullYear();

			this.transaction._submitteddate = today

			let one_day = 1000 * 60 * 60 * 24
			let tdd = new Date(this.transaction._transactionduedate)
			let date1 = tdd.getTime();
			let date2 = now.getTime();
			let difference = date1 - date2;
			let daysdif = Math.round(difference / one_day);
			let strdatesdif;

			if (daysdif == 1)
				strdatesdif = daysdif + ' day ahead';
			else if (daysdif > 1)
				strdatesdif = daysdif + ' days ahead';
			else if (daysdif == -1)
				strdatesdif = Math.abs(daysdif) + ' day late';
			else if (daysdif < -1)
				strdatesdif = Math.abs(daysdif) + ' days late';
			else if (daysdif == 0)
				strdatesdif = 'on time';

			this.transaction._datesdif = strdatesdif

			if (strdatesdif.indexOf("late") >= 0)
				this.latedatesdif = true



			//this.openDetails()	
		}

		this.FileName = this.transaction._attachmentname ? this.transaction._attachmentname : '';

	}

	activeMenuBK(fab: FabContainer) {
		let element = document.getElementById("bkmenu")
		element.style.display == 'block' ? element.style.display = 'none' : element.style.display = 'block';
		if (fab)
			fab.close();
	}

	fabaction(socialNet: string, fab: FabContainer, item: Item) {
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
			case "viewrfq": {
				if (this.ViewPremiumContent) {
					this.ViewRFQ();
				}
				break;
			}
			case "uploadquote": {
				if (!this.ContentDisabled) {
					this.UploadQuote(item);
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
		}
		else {
			if (this.transaction._transactiontype == "RFQ")
				element.setAttribute("style", "padding: 10px 12px 0px 12px;");

			if (!this.itemdetail) {
				let seq = this.transaction.QuoteDetails(this.transaction._sourceid, this.transaction._dbname);

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

						this.itemdetail = res;
						//this.QuoteAmount = this.transaction._amountsubmitted ? Number(this.transaction._amountsubmitted) : this.itemdetail[0].QuoteAmount; 
						this.RequestTime = this.itemdetail[0].RequestTime || '';
						this.RFQFileDescription = this.itemdetail[0].RFQFileDescription;
						this.RFQFileName = this.itemdetail[0].RFQFileName;
						this.QuoteFileDescription = this.itemdetail[0].QuoteFileDescription;
						this.QuoteFileName = this.itemdetail[0].QuoteFileName;
						this.JobLocation = this.itemdetail[0].JobLocation;
						if (this.itemdetail[0].LocationAddress != "") {
							this.LocationAddress = this.itemdetail[0].LocationAddress + ", " + this.itemdetail[0].LocationCitynme + ", " + this.itemdetail[0].LocationState + " " + this.itemdetail[0].LocationZipcde
						} else {
							if (this.itemdetail[0].LocationCitynme != "") {
								this.LocationAddress = this.itemdetail[0].LocationCitynme + ", " + this.itemdetail[0].LocationState + " " + this.itemdetail[0].LocationZipcde
							} else {
								this.LocationAddress = this.itemdetail[0].LocationState + " " + this.itemdetail[0].LocationZipcde
							}
						}

						this.Description = this.itemdetail[0].WorkDescription;
						this.Constraints = this.itemdetail[0].PerformanceConstraints;
						this.Instructions = this.itemdetail[0].xInstructions;
						this.loadingControl('dismiss', loading)
						this.moredetails = true;
					}), (err) => {
						this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
							this.doToast(value.CONNECTION_ERROR);
						})
					}
				})
			} else {
				this.moredetails = true;
			}
		}
	}

	openPlanRoom() {
		window.open(encodeURI(this.constant.urlEnviroment + '/rts/app/asp/PlanroomFromSource.asp?WorkorderID=' + this.project._projectnumber + '&client=' + this.transaction._dbname + '&userid=' + this.UserID + '&Source=RFQ&SourceID=' + this.transaction._sourceid), "_system", "location=yes");
	}

	openQuoteAttachment() {
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

			if (!this.ContentDisabled) {
				window.open(encodeURI(this.constant.urlEnviroment + '/TS/CompaniesTS/' + this.transaction._dbname + '/Uploads/Quotes/' + this.FileName), "_system", "location=yes");
			} else {
				window.open(this.constant.urlTPUploads +
					this.user._usercompanyid + '/' +
					this.customer._customerid + '/' +
					this.project._projectnumber + '/quotes/' + this.FileName, "_system", "location=yes");
			}
			this.loadingControl('dismiss', loading)
		})
	}

	openRFQAttachment() {
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
			window.open(encodeURI(this.constant.urlEnviroment + '/TS/CompaniesTS/' + this.transaction._dbname + '/Uploads/Quotes/' + this.RFQFileName), "_system", "location=yes");
			this.loadingControl('dismiss', loading)
		})
	}


	UploadQuote(item: Item) {
		let params = {
			FacilityID: this.FacilityID,
			UserID: this.UserID
		}
		this.navCtrl.push('RFQUploadPage', params);
	}

	ViewRFQ() {
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

			if (!this.ContentDisabled) {
				let filePath: string = 'contentviewlnk=../workorders/quotes_/Print_QuoteRequest.asp&woid=' + this.project._projectnumber + '&mod=' + this.project._projectscope +
					'&wosta=' + this.WoStatus + '&WorkorderID=' + this.project._projectnumber + '&WorkorderMod=' + this.project._projectscope +
					'&WorkorderStatus=' + this.WoStatus + '&FacilityID=' + this.FacilityID + '&QuoteID=' + this.transaction._sourceid + '&client=' + this.transaction._dbname +
					'&vendor=' + this.VendorID + '&onlyprint=true&uploadQuote=true&userid=' + this.UserID + '&SaveViewEmail=yes&tpview=true';

				let base64Str: string = window.btoa(filePath);
				window.open(encodeURI(this.constant.urlEnviroment + '/rts/app/asp/tpl.projectconsole.asp?p=' + base64Str + '&ContactID=' + this.UserID), "_system", "location=yes");
			} else {
				window.open(this.constant.urlTPUploads +
					this.user._usercompanyid + '/' +
					this.customer._customerid + '/' +
					this.project._projectnumber + '/rfq/' +
					'RFQ-' + this.user._usercompanyid + '-' + this.project._projectnumber + '-' + this.project._projectscope + '-' + this.transaction._transactionid + '.pdf', "_system", "location=yes");
			}
			this.loadingControl('dismiss', loading)
		})
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
}
