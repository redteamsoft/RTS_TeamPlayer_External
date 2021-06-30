import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, Refresher, LoadingController, ToastController, AlertController, ModalController, Modal, ModalOptions, PopoverController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Project, Transaction, Constant, User, Customer } from '../../providers';
import { Item } from '../../models/item';
import { PopoverComponent } from '../../components/popover/popover';




@IonicPage()
@Component({
	selector: 'page-list-billing',
	templateUrl: 'list-billing.html'
})
export class ListBillingPage {
	currentItems: Item[];
	newItem: Item;
	queryText = '';
	lblProjectID = String;
	lblProjectName = String;
	lblTransactionNumber = String;
	lbltotalbilled: any;
	LOADING_MESSAGE: any;
	CONNECTION_ERROR: any;
	CurrentOpenCommitment: any;
	public ContentDisabled: boolean = false;
	public ViewPremiumContent: boolean = false;
	public PremiunContent: boolean = false;
	public olddata: boolean = false;
	TotalBills: number;
	TotalContractValue: number;
	Taxes: number;
	public JobLocation: String
	public LocationAddress: String
	itemdetail: any;
	BILL_WARNING_TITLE: any;
	BILL_WARNING_RECREATE: any;
	BILL_WARNING_TEAMPLAYERINVOICE: any;
	btnAccess: any;

	constructor(public transaction: Transaction,
		public constant: Constant,
		public user: User,
		public customer: Customer,
		public project: Project,
		public viewCtrl: ViewController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private modal: ModalController,
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public platform: Platform,
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

		this.btnAccess = this.user.validateUserPermissions("Billing");
		if(this.btnAccess == "NoAccess"){
			this.navCtrl.setRoot('ErrorUnauthorizedPage');
		}

		this.ContentDisabled = this.user._ContentDisabled;
		this.PremiunContent = this.user._PremiumContent;
		this.ViewPremiumContent = this.user._ViewPremiumContent;

		if (this.transaction._olddata == 1)
			this.olddata = true

		this.lblProjectID = this.project._projectnumber;
		this.lblProjectName = this.project._projectname;
		this.lblTransactionNumber = this.transaction._transactionnumber;

		this.loadBillings();

		this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
			this.LOADING_MESSAGE = value.LOADING_MESSAGE;
		});

		this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
			this.CONNECTION_ERROR = value.CONNECTION_ERROR;
		});

		this.translate.get(['BILL_WARNING_TITLE']).subscribe((value) => {
			this.BILL_WARNING_TITLE = value.BILL_WARNING_TITLE;
		});

		this.translate.get(['BILL_WARNING_RECREATE']).subscribe((value) => {
			this.BILL_WARNING_RECREATE = value.BILL_WARNING_RECREATE;
		});

		this.translate.get(['BILL_WARNING_TEAMPLAYERINVOICE']).subscribe((value) => {
			this.BILL_WARNING_TEAMPLAYERINVOICE = value.BILL_WARNING_TEAMPLAYERINVOICE;
		});
		
	}

	ionViewWillEnter() {
		if (this.navCtrl.getPrevious().name == "ListBillingPage" && this.user._refreshpage == "true") {
			this.loadBillings();
			this.user._refreshpage = "";
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

	loadBillings() {
		let seq = this.transaction.BillingList();
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

				this.lbltotalbilled = 0

				for (var i = 0; i <= this.currentItems.length - 1; i++) {
					if (this.currentItems[i].Status == "Submitted" || this.currentItems[i].Status == "In Review"
						|| this.currentItems[i].Status == "Approved" || this.currentItems[i].Status == "Draft") {
						this.lbltotalbilled = this.lbltotalbilled + this.currentItems[i].NetAmountDue
					}

					let strdif = this.currentItems[i].DatesDif

					if (strdif.indexOf("Overdue") >= 0) {
						this.currentItems[i].bandstyle1 = true
						this.currentItems[i].bandstyle2 = true
					} else if (strdif.indexOf("Paid") >= 0) {
						this.currentItems[i].bandstyle1 = false
					} else {
						this.currentItems[i].bandstyle1 = true
					}
				}

				let seqCommitmentDetails = this.transaction.CommitmentDetails(this.transaction._charsourceid, this.transaction._transactionnumber, this.transaction._dbname);

				seqCommitmentDetails.subscribe((res: any) => {
					//this.loadingControl('dismiss', loading);
					this.TotalContractValue = Number(res[1][0].SubOrderTotal);
					this.Taxes = Number(res[1][0].Taxes);

					this.itemdetail = res[0][0];
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
						this.LocationAddress = this.itemdetail.LocationAddress.trim() + ", " + this.itemdetail.LocationCitynme.trim() + ", " + this.itemdetail.LocationState.trim() + " " + this.itemdetail.LocationZipcde.trim()
					} else {
						if (this.itemdetail.LocationCitynme.trim() != "") {
							this.LocationAddress = this.itemdetail.LocationCitynme.trim() + ", " + this.itemdetail.LocationState.trim() + " " + this.itemdetail.LocationZipcde.trim()
						} else {
							this.LocationAddress = this.itemdetail.LocationState.trim() + " " + this.itemdetail.LocationZipcde.trim()
						}
					}

					let seqBillNumber = this.transaction.BillNumber();

					seqBillNumber.subscribe((res: any) => {
						//this.loadingControl('dismiss', loading);
						this.TotalBills = res[1][0].TotalBills;
						if (this.TotalBills == 0) {
							this.loadingControl('dismiss', loading);
							if (this.Taxes > 0) {
								this.CurrentOpenCommitment = this.TotalContractValue + this.Taxes;
							} else {
								this.CurrentOpenCommitment = this.TotalContractValue;
							}
						} else {
							let seqOpenCommitment = this.transaction.OpenCommitment(0);

							seqOpenCommitment.subscribe((res: any) => {
								this.loadingControl('dismiss', loading);
								if (this.Taxes > 0) {
									this.CurrentOpenCommitment = (this.TotalContractValue + this.Taxes) - (Number(res[0].TotalChangeInProgress) + Number(res[0].TotalChangeInTax));
								} else {
									this.CurrentOpenCommitment = this.TotalContractValue - Number(res[0].TotalChangeInProgress);
								}
							}), (err) => {
								this.loadingControl('dismiss', loading);
								this.doToast(this.CONNECTION_ERROR);
							};
						}
					}), (err) => {
						this.doToast(this.CONNECTION_ERROR);
						this.loadingControl('dismiss', loading);
					};
				}), (err) => {
					this.doToast(this.CONNECTION_ERROR);
					this.loadingControl('dismiss', loading);
				};



			}), (err) => {
				this.loadingControl('dismiss', loading);
				this.doToast(this.CONNECTION_ERROR);
			};
		})
	}

	openView(item: Item) {
		let openview
		let params: string = 'id=' + this.transaction._transactionid + '&detailid=' + item.TransactionDetailId + '&client=' + this.transaction._dbname + '&status=' + item.Status.toLowerCase();
		let base64Str: string = window.btoa(params);

		if (this.ContentDisabled && this.PremiunContent) {
			openview = this.constant.urlTPUploads +
				this.user._usercompanyid + '/' +
				this.customer._customerid + '/' +
				this.project._projectnumber + '/billing/' + item.AttachName

		} else {
			if (item.Status.toLowerCase() == "draft") {
				openview = this.constant.urlEnviroment + '/rts/app/workorders/billing_/Views/TeamPlayer_SubmitBilling.asp?p=' + base64Str;
			} else {
				openview = 'https://' + this.transaction._dbname + this.constant.urlRTUploaded + '/Disbursements/' + item.AttachName;

			}
		}

		window.open(encodeURI(openview), "_system", "location=yes");
		/*this.transaction._transactionStorage(item)
		this.navCtrl.push(nextItem);*/
	}

	doToast(str) {
		let toast = this.toastCtrl.create({
			message: str,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}

	doRefresh(refresher: Refresher) {

		let seq = this.transaction.BillingList();
		seq.subscribe((res: any) => {
			this.currentItems = res;

			this.lbltotalbilled = 0

			for (var i = 0; i <= this.currentItems.length - 1; i++) {
				if (this.currentItems[i].Status == "Submitted" || this.currentItems[i].Status == "In Review"
					|| this.currentItems[i].Status == "Approved" || this.currentItems[i].Status == "Draft") {
					this.lbltotalbilled = this.lbltotalbilled + this.currentItems[i].NetAmountDue
				}

				let strdif = this.currentItems[i].DatesDif

				if (strdif.indexOf("Overdue") >= 0) {
					this.currentItems[i].bandstyle1 = true
					this.currentItems[i].bandstyle2 = true
				} else if (strdif.indexOf("Paid") >= 0) {
					this.currentItems[i].bandstyle1 = false
				} else {
					this.currentItems[i].bandstyle1 = true
				}
			}

			let seqCommitmentDetails = this.transaction.CommitmentDetails(this.transaction._charsourceid, this.transaction._transactionnumber, this.transaction._dbname);

			seqCommitmentDetails.subscribe((res: any) => {
				this.TotalContractValue = Number(res[1][0].SubOrderTotal);
				this.Taxes = Number(res[1][0].Taxes);

				let seqBillNumber = this.transaction.BillNumber();

				seqBillNumber.subscribe((res: any) => {
					//this.loadingControl('dismiss', loading);
					this.TotalBills = res[1][0].TotalBills;
					if (this.TotalBills == 0) {
						//this.loadingControl('dismiss', loading);
						if (this.Taxes > 0) {
							this.CurrentOpenCommitment = this.TotalContractValue + this.Taxes;
						} else {
							this.CurrentOpenCommitment = this.TotalContractValue;
						}
					} else {
						let seqOpenCommitment = this.transaction.OpenCommitment(0);

						seqOpenCommitment.subscribe((res: any) => {
							//this.loadingControl('dismiss', loading);
							if (this.Taxes > 0) {
								this.CurrentOpenCommitment = (this.TotalContractValue + this.Taxes) - (Number(res[0].TotalChangeInProgress) + Number(res[0].TotalChangeInTax));
							} else {
								this.CurrentOpenCommitment = this.TotalContractValue - Number(res[0].TotalChangeInProgress);
							}
						}), (err) => {
							//this.loadingControl('dismiss', loading);
							this.doToast(this.CONNECTION_ERROR);
						};
					}
				}), (err) => {
					this.doToast(this.CONNECTION_ERROR);
					//this.loadingControl('dismiss', loading);
				};
			}), (err) => {
				this.doToast(this.CONNECTION_ERROR);
				//this.loadingControl('dismiss', loading);
			};


			setTimeout(() => {
				refresher.complete();
				this.translate.get(['BILLING_LIST_UPDATED']).subscribe((value) => {
					const toast = this.toastCtrl.create({
						message: value.BILLING_LIST_UPDATED,
						duration: 3000
					});
					toast.present();
				});
			}, 1000);
		});
	}

	updateLstBilling() {
		this.currentItems = this.getfilterList(this.queryText)
	}

	getfilterList(queryText = '') {
		queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
		let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

		this.currentItems.forEach((item: any) => {
			item.hide = true;
			this.filterBilling(item, queryWords);
			if (!item.hide) {
				item.hide = false;
			}
		});
		return this.currentItems;
	}

	filterBilling(item: any, queryWords: string[]) {
		let matchesQueryText = false;
		if (queryWords.length) {
			queryWords.forEach((queryWord: string) => {
				if (item.InvoiceNumber.toLowerCase().indexOf(queryWord) > -1 ||
					item.Status.toLowerCase().indexOf(queryWord) > -1 ||
					item.TransactionNumbe.toLowerCase().indexOf(queryWord) > -1) {
					matchesQueryText = true;
				}
			});
		} else {
			matchesQueryText = true;
		}
		item.hide = !(matchesQueryText);
	}

	loadingControl(band = '', loading) {
		if (band === 'start') {
			loading.present();
		} else {
			loading.dismiss();
		}
	}

	openItem(item: Item) {
		this.transaction._transactiondetailid = item.TransactionDetailId;
		window.localStorage.setItem('transactiondetailid', this.transaction._transactiondetailid);

		if (item.Status == "Draft") {
			this.navCtrl.push("EditBillingPage", {
				validate: "true"
			});
		} else if (item.Status == "Submitted" || item.Status == "In Review" || item.Status == "Approved" || item.Status == 'Rejected by Customer') {
			this.navCtrl.push("ViewBillingPage");
		}
	}

	enterBilling() {
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

		if (this.transaction._status == "Closed") {
			this.loadingControl('dismiss', loading);
			this.translate.get(['CONTRACT_WARNING_CLOSED_STATUS']).subscribe((value) => {
				this.doToast(value.CONTRACT_WARNING_CLOSED_STATUS);
			});
		} else {
			let seq = this.transaction.BillValidate();

			seq.subscribe((res: any) => {
				this.loadingControl('dismiss', loading);
				let BillsInDraft = res[0][0].BillsInDraft;
				let IsTeamPlayerInvoice = res[1][0].IsTeamPlayerInvoice.toUpperCase();
				if (IsTeamPlayerInvoice == 'YES') {
					if (BillsInDraft > 0) {
						this.showValidate('There is already a Draft Bill for this Contract.');
					} else {
						this.navCtrl.push("EnterBillingPage", {
							validate: "true"
						});
					}
				} else {
					this.showValidate(this.BILL_WARNING_TEAMPLAYERINVOICE);
				}
			}), (err) => {
				this.doToast(this.CONNECTION_ERROR);
				this.loadingControl('dismiss', loading);
			}
		}
	}

	showValidate(message: string) {
		const confirm = this.alertCtrl.create({
			title: 'Warning!',
			message: message,
			buttons: [
				{
					text: 'Ok'
				}
			]
		});
		confirm.present();
	}

	presentPopover(myEvent, item: Item) {
		/* let loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<div class="spinner-loading"> 
			  <div class="loading-bar"></div>
			  <div class="loading-bar"></div>
			  <div class="loading-bar"></div>
			  <div class="loading-bar"></div>
			</div>` + this.LOADING_MESSAGE
		});

		this.loadingControl('start', loading); */
		let seq = this.transaction.BillOptions(item.TransactionDetailId);

		seq.subscribe((res: any) => {
			//this.loadingControl('dismiss', loading);
			let billSelected = {
				TransactionDetailId: item.TransactionDetailId,
				AttachName: item.AttachName,
				Status: item.Status,
				ReviseBill: res[0].ReviseThisBill.toUpperCase()
			}
			const popover = this.popoverCtrl.create(PopoverComponent, billSelected);

			popover.present({
				ev: myEvent
			});

			popover.onDidDismiss(popoverData => {
				//console.log(popoverData);

				if (popoverData != null) {
					switch (popoverData.event) {
						case "View":
							this.openView(item);
							break;
						case "Email":
							//console.log(item);
							this.openModalEmail(item)
							break;
						case "Recreate":
							this.PrevRecreateBill(item);
							break;
					}
				}

			})
		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
			//this.loadingControl('dismiss', loading);
		}

	}

	openModalEmail(item: Item) {
		const myModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};
		//const myModalData = {};
		//const i = {}
		const myModal: Modal = this.modal.create('ModalPageEmail', { data: item, JobLocation: this.JobLocation, LocationAddress: this.LocationAddress }, myModalOptions);

		myModal.present();

		myModal.onWillDismiss((data) => {
			if (data) {

			}
		});
	}

	PrevRecreateBill(item: Item) {
		//console.log(item);

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


		let seq = this.transaction.BillWarning(item.TransactionDetailId);

		seq.subscribe((res: any) => {
			this.loadingControl('dismiss', loading);
			let Warning = res[0].Warning.toUpperCase();

			switch (Warning) {
				case "CONTINUE":
					this.RecreateBill(item);
					break;
				case "STOP":
					this.showConfirm(this.BILL_WARNING_RECREATE, item);

					break;
				case "DISMISS":
					break;
			}

		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
			this.loadingControl('dismiss', loading);
		}
	}

	RecreateBill(item: Item) {
		//console.log(item);

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


		let seq = this.transaction.RecreateBill(item.TransactionDetailId);

		seq.subscribe((res: any) => {
			this.loadingControl('dismiss', loading);
			this.loadBillings();
			this.transaction._transactiondetailid = res[0].New_PK_TransactionDetailId_tp;
			window.localStorage.setItem('transactiondetailid', this.transaction._transactiondetailid);
			this.navCtrl.push("EditBillingPage", {
				validate: "true"
			});
			//this.showConfirm('this.BILL_SUCCESS_MESSAGE');
		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
			this.loadingControl('dismiss', loading);
		}


	}

	showConfirm(message: string, item: Item) {
		const confirm = this.alertCtrl.create({
			title: this.BILL_WARNING_TITLE,
			message: message,
			buttons: [
				{
					text: 'Cancel',
					handler: () => {
					}
				},
				{
					text: 'Confirm',
					handler: () => {
						this.RecreateBill(item);
					}
				}
			],
			enableBackdropDismiss: false
		});
		confirm.present();
	}

}



