import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, FabContainer, Content, ViewController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
//import { IOSFilePicker } from '@ionic-native/file-picker';
import { Platform, LoadingController, ToastController, Modal, ModalController, ModalOptions, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, User, Customer, Project, Constant } from '../../providers';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Item } from '../../models/item';
import { File } from '@ionic-native/file/ngx';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
import * as moment from 'moment-timezone';

@IonicPage()
@Component({
	selector: 'page-edit-billing',
	templateUrl: 'edit-billing.html'
})
export class EditBillingPage {
	currentItems: Item[];
	attachItems: Item[];
	attachNewItems: Item[];
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
	public Lines: any;
	public Commitment: any;
	public billForm: FormGroup;
	private socket = io(this.constant.urleapps);
	TaxAmount: any;
	ThisPeriodBilling: any;
	TotalPriorBilling: any;
	NetAmountDue: any;
	TaxRate: any;
	TaxValueRate: any;
	RetainageRate: any;
	TempRetainageRate: any;
	TaxVenueName: any;
	VATVenueName: any;
	TotalContractValue: any;
	TotalCompletedStored: any;
	PriorRetainage: any;
	BILL_WARNING_TAXES: any;
	BILL_WARNING_BILL_ZERO: any;
	LOADING_MESSAGE: any;
	CONNECTION_ERROR: any;
	BILL_SUCCESS_MESSAGE: any;
	BILL_SUCCESS_TITLE: any;
	BILL_WARNING_OPEN_COMMITMENT: any;
	BILL_DESCRIPTION_DEFAULT: any;
	BILL_WARNING_SUCCESS_DRAFT: any;
	BILL_WARNING_NEED_EAPPS: any;
	BILL_WARNING_COMMITMENT_STATUS: any;
	BILL_WARNING_LINE_STATUS: any;
	BILL_WARNING_RETAINAGE_ZERO: any;
	BILL_WARNING_RETAINAGE_ZERO_TITLE: any;
	BILL_WARNING_NEW_RETAINAGE: any;
	BILL_WARNING_ATTACH_DESCRIPTION: any;
	BILL_WARNING_TEAMPLAYERINVOICE: any;
	CONFIRM_BUTTON: any;
	CANCEL_BUTTON: any;
	DELETE_ATTACH_MESSAGE: any;
	AGREE_BUTTON: any;
	DISAGREE_BUTTON: any;
	ARE_YOU_SURE: any;
	today: number = Date.now();
	validate: any;
	TotalBills: number;
	TotalAttachBills: number;
	BoTypeCanadianTaxability: any;
	BoTypeTaxability: any;
	BoTypeRetainage: any;
	WarningRetainage: any;
	IsBrowser: boolean = false;
	showTools: boolean = false;
	public PremiunContent: boolean = false;
	billFilters: Item[];
	filterModel: any;
	VendorCertification: any;
	isNotaryCertification: any;
	NotaryCertification: any;
	isArchitectCertification: any;
	ArchitectCertification: any;
	MultipleCC: boolean = false;
	IsCompanySage100: any;
	IsCompanySage300: any;
	Alias: any;
	LinesReset: any;

	constructor(public user: User,
		public customer: Customer,
		public project: Project,
		public transfer: FileTransfer,
		public constant: Constant,
		public file: File,
		public plt: Platform,
		//public filePicker: IOSFilePicker,
		public fileChooser: FileChooser,
		public navCtrl: NavController,
		public transaction: Transaction,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private fb: FormBuilder,
		private modal: ModalController,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public platform: Platform,
		public navParams: NavParams,
		public element: ElementRef
	) {
		if (this.platform.is('core') || this.platform.is('mobileweb')) {
			this.IsBrowser = true;
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

		this.ContentDisabled = this.user._ContentDisabled;
		this.TaxRate = Number(this.transaction._taxvenuevalue) / 100;
		this.TaxValueRate = Number(this.transaction._vatvenuevalue) / 100;
		this.RetainageRate = Number(this.transaction._retainagevalue) / 100;
		this.ThisPeriodBilling = 0.00;
		this.TotalPriorBilling = 0.00;
		this.NetAmountDue = 0.00;
		this.TotalContractValue = 0.00;
		this.TotalCompletedStored = 0.00;
		this.PriorRetainage = 0.00;
		this.attachItems = []
		this.attachNewItems = []
		this.PremiunContent = this.user._PremiumContent;
		this.filterModel = 'all';
		this.billFilters = [
			{ value: 'all', text: 'All'},
			{ value: 'disputed', text: 'Disputed'},
			{ value: 'presently', text: 'Presently Stored'},
			{ value: 'under', text: 'Under 100% Billed'},		
		]

		this.ItemsFormat = [{
			id: 1, name: "AIA-Style G702/703-1992"
		}];

		this.ItemsRemitTo = [{
			id: this.user._usercompanyid,
			name: this.user._companyname
		}];

		this.validate = navParams.get('validate');

		this.translate.get(['BILL_WARNING_TAXES']).subscribe((value) => {
			this.BILL_WARNING_TAXES = value.BILL_WARNING_TAXES;
		});

		this.translate.get(['BILL_WARNING_BILL_ZERO']).subscribe((value) => {
			this.BILL_WARNING_BILL_ZERO = value.BILL_WARNING_BILL_ZERO;
		});

		this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
			this.LOADING_MESSAGE = value.LOADING_MESSAGE;
		});

		this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
			this.CONNECTION_ERROR = value.CONNECTION_ERROR;
		});

		this.translate.get(['BILL_SUCCESS_TITLE']).subscribe((value) => {
			this.BILL_SUCCESS_TITLE = value.BILL_SUCCESS_TITLE;
		});

		this.translate.get(['BILL_SUCCESS_MESSAGE']).subscribe((value) => {
			this.BILL_SUCCESS_MESSAGE = value.BILL_SUCCESS_MESSAGE.replace("{{company}}", this.customer._customername);
		});

		this.translate.get(['BILL_WARNING_OPEN_COMMITMENT']).subscribe((value) => {
			this.BILL_WARNING_OPEN_COMMITMENT = value.BILL_WARNING_OPEN_COMMITMENT;
		});

		this.translate.get(['BILL_DESCRIPTION_DEFAULT']).subscribe((value) => {
			this.BILL_DESCRIPTION_DEFAULT = value.BILL_DESCRIPTION_DEFAULT;
		});

		this.translate.get(['BILL_WARNING_SUCCESS_DRAFT']).subscribe((value) => {
			this.BILL_WARNING_SUCCESS_DRAFT = value.BILL_WARNING_SUCCESS_DRAFT;
		});

		this.translate.get(['BILL_WARNING_NEED_EAPPS']).subscribe((value) => {
			this.BILL_WARNING_NEED_EAPPS = value.BILL_WARNING_NEED_EAPPS;
		});

		this.translate.get(['BILL_WARNING_COMMITMENT_STATUS']).subscribe((value) => {
			this.BILL_WARNING_COMMITMENT_STATUS = value.BILL_WARNING_COMMITMENT_STATUS;
		});

		this.translate.get(['BILL_WARNING_LINE_STATUS']).subscribe((value) => {
			this.BILL_WARNING_LINE_STATUS = value.BILL_WARNING_LINE_STATUS;
		});

		this.translate.get(['BILL_WARNING_RETAINAGE_ZERO']).subscribe((value) => {
			this.BILL_WARNING_RETAINAGE_ZERO = value.BILL_WARNING_RETAINAGE_ZERO;
		});

		this.translate.get(['BILL_WARNING_RETAINAGE_ZERO_TITLE']).subscribe((value) => {
			this.BILL_WARNING_RETAINAGE_ZERO_TITLE = value.BILL_WARNING_RETAINAGE_ZERO_TITLE;
		});

		this.translate.get(['BILL_WARNING_NEW_RETAINAGE']).subscribe((value) => {
			this.BILL_WARNING_NEW_RETAINAGE = value.BILL_WARNING_NEW_RETAINAGE;
		});

		this.translate.get(['BILL_WARNING_ATTACH_DESCRIPTION']).subscribe((value) => {
			this.BILL_WARNING_ATTACH_DESCRIPTION = value.BILL_WARNING_ATTACH_DESCRIPTION;
		});

		this.translate.get(['CONFIRM_BUTTON']).subscribe((value) => {
			this.CONFIRM_BUTTON = value.CONFIRM_BUTTON;
		});

		this.translate.get(['CANCEL_BUTTON']).subscribe((value) => {
			this.CANCEL_BUTTON = value.CANCEL_BUTTON;
		});

		this.translate.get(['ARE_YOU_SURE']).subscribe((value) => {
			this.ARE_YOU_SURE = value.ARE_YOU_SURE;
		});

		this.translate.get(['DELETE_ATTACH_MESSAGE']).subscribe((value) => {
			this.DELETE_ATTACH_MESSAGE = value.DELETE_ATTACH_MESSAGE;
		});

		this.translate.get(['AGREE_BUTTON']).subscribe((value) => {
			this.AGREE_BUTTON = value.AGREE_BUTTON;
		});

		this.translate.get(['DISAGREE_BUTTON']).subscribe((value) => {
			this.DISAGREE_BUTTON = value.DISAGREE_BUTTON;
		});

		this.translate.get(['BILL_WARNING_TEAMPLAYERINVOICE']).subscribe((value) => {
			this.BILL_WARNING_TEAMPLAYERINVOICE = value.BILL_WARNING_TEAMPLAYERINVOICE;
		});

		this.joinRoom({ user: this.user._useremail, room: this.user._usercompanyid });
	}

	deleteAttach(item) {
		const confirm = this.alertCtrl.create({
			title: this.ARE_YOU_SURE,
			message: this.DELETE_ATTACH_MESSAGE,
			buttons: [
				{
					text: this.DISAGREE_BUTTON,
					handler: () => {
					}
				},
				{
					text: this.AGREE_BUTTON,
					handler: () => {

						let seq = this.transaction.BillDeleteAttachment(item.uploadid);

						seq.subscribe((res: any) => {
							const index = this.attachItems.indexOf(item, 0);
							if (index > -1) {
								this.attachItems.splice(index, 1);
							}
						}), (err) => {
							this.doToast(this.CONNECTION_ERROR);
						}

					}
				}
			],
			enableBackdropDismiss: false
		});
		confirm.present();
	}

	deleteNewAttach(item) {
		const index = this.attachNewItems.indexOf(item, 0);
		if (index > -1) {
			this.attachNewItems.splice(index, 1);
		}
	}

	pickImage() {
		const myModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};

		const myModalData = '';
		let i = 0;
		const myModal: Modal = this.modal.create('ModalPageAddFiles', { data: myModalData, line: i }, myModalOptions);
		myModal.present();

		myModal.onWillDismiss((data) => {
			if (this.IsBrowser) {
				if (data) {
					this.attachNewItems.push(...data)
				}
			} else {
				if (data) {
					this.attachNewItems.push(data)
				}
			}
		});
	}

	uploadAttachment(item, num) {

		let fileName = 'TPCI-' + this.project._projectnumber + '-' + this.project._projectscope + '-' + this.transaction._transactionid + this.transaction._transactiondetailid + num + '.' + item.type;
		let urlUploadRT = this.constant.urlUploadRT;
		let dbname = this.transaction._dbname;

		let fileUploadUrl = urlUploadRT + '?bdname=' + dbname + '&companyid=' + this.user._usercompanyid + '&customerid=' + this.customer._customerid + '&projectnumber=' + this.project._projectnumber + '&type=TPBILLING';

		if (this.IsBrowser) {
			let formData = new FormData();
			formData.append('Filedata', item.file, fileName);

			let seq = this.transaction.UploadFileBrowser(formData, fileUploadUrl).share();

			seq.subscribe((res: any) => {
				//console.log(new Date())
				//console.log(res)
			}, err => {
				console.error('ERROR', err);
			});
		} else {
			let tcreate = this.transfer.create();
			const fileTransfer: FileTransferObject = tcreate;
			let options: FileUploadOptions = {
				fileKey: "Filedata",
				fileName: fileName,
				chunkedMode: false,
				params: { 'name': fileName }
			}

			fileTransfer.upload(item.file, fileUploadUrl, options)
				.then((data) => {
					//console.log(data)
				}, (err) => {
					console.log(err)
				})
		}

	}


	insertUploadAttachment(item, num) {

		let fileName = 'TPCI-' + this.project._projectnumber + '-' + this.project._projectscope + '-' + this.transaction._transactionid + this.transaction._transactiondetailid + num + '.' + item.type;
		let UploadFolder = this.user._usercompanyid + '/' + this.customer._customerid + '/' + this.project._projectnumber + '/billing/uploads/';
		let seq = this.transaction.UploadAttachment(item, fileName, UploadFolder, num);

		seq.subscribe((res: any) => {
		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
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

	joinRoom(data) {
		this.socket.emit('join', data);
	}

	leaveRoom(data) {
		this.socket.emit('leave', data);
	}

	sendMessage(data) {
		this.socket.emit('eAppsCoin', data);
	}

	ionViewWillEnter() {

		if (this.validate != "true") {
			let loadingAux = this.loadingCtrl.create({
				spinner: 'hide',
				content: `<div class="spinner-loading"> 
			  <div class="loading-bar"></div>
			  <div class="loading-bar"></div>
			  <div class="loading-bar"></div>
			  <div class="loading-bar"></div>
			</div>` + this.LOADING_MESSAGE
			});
			this.loadingControl('start', loadingAux);

			let seq = this.transaction.EditBillValidate();

			seq.subscribe((res: any) => {
				this.loadingControl('dismiss', loadingAux);
				let BillsInDraft = res[0].BillInDraft;
				if (BillsInDraft == 0) {
					this.showValidate('Bill already was submitted!');
				}
			}), (err) => {
				this.doToast(this.CONNECTION_ERROR);
				this.loadingControl('dismiss', loadingAux);
			}
		}
	}



	ngOnInit() {
		// we will initialize our form here
		this.billForm = this.fb.group({
			transaction: this.transaction._transactionid,
			commitment: this.transaction._charsourceid,
			billNumber: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
			billDate: ['', Validators.compose([Validators.required])],
			billThroughDate: ['', Validators.compose([Validators.required])],
			billFormat: [],
			billRemitTo: [],
			billFilter: [],
			billCareOf: ['', Validators.compose([Validators.maxLength(100)])],
			billDescription: ['', Validators.compose([Validators.maxLength(1000)])],
			billLines: this.fb.array([]),
			billTotalContractValue: [],
			billTotalPriorBilling: [],
			billThisPeriodBilling: [],
			billTotalCompletedStored: [],
			billPriorRetainage: [],
			billTotalRetainage: [],
			billTotalRetainagePercent: [],
			billCurrentRetainage: this.transaction.getCurrency(0),
			billCurrentRetainageStatus: true,
			billTaxName: [],
			billTax: this.transaction.getCurrency(0),
			billValueTaxName: [],
			billValueTax: this.transaction.getCurrency(0),
			billNetAmountDue: [],
			user: this.user._userid,
			billStatus: [],
			projectNumber: this.project._projectnumber,
			projectScope: this.project._projectscope,
			billFilename: [''],
			dbname: this.transaction._dbname,
			billID: [],
			warningRetainage: [],
			PreferenceBilling: this.user._preferencebilling,
			DisputedRetainage: [],
			DisputedTax: [],
			DisputedVAT: [],
			billTerms: false,
			billTermsContent: [''],
			billSubmittedDateLocale: [],
			billSubmittedTimezone: []
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

		let seqPreviousBill = this.transaction.PreviousBill();

		seqPreviousBill.subscribe((res: any) => {
			if (res.length != 0) {
				this.PriorRetainage = Number(res[0][0].PriorRetainage);
				this.TempRetainageRate = Number(res[1][0].RetainageRate) / 100
			}

			let seqCommitmentDetails = this.transaction.CommitmentDetails(this.transaction._charsourceid, this.transaction._transactionnumber, this.transaction._dbname);

			seqCommitmentDetails.subscribe((res: any) => {
				//this.loadingControl('dismiss', loading);

				this.LinesReset = res[1];	
				this.TotalContractValue = Number(res[1][0].SubOrderTotal);
				this.IsCompanySage100 = res[2][0].IsCompanySage100;
				this.IsCompanySage300 = res[2][0].IsCompanySage300;
				this.Alias = res[3][0].Alias;
				this.VendorCertification = res[3][0].VendorCertification;
				this.isNotaryCertification = res[3][0].isNotaryCertification;
				this.NotaryCertification = res[3][0].NotaryCertification;
				this.isArchitectCertification = res[3][0].isArchitectCertification;
				this.ArchitectCertification = res[3][0].ArchitectCertification;
							

				let seqBill = this.transaction.BillDetails();

				seqBill.subscribe((res: any) => {

					let item = res[0][0];
					this.Lines = res[1];					

					for (var key in this.Lines) {
						this.TotalPriorBilling += Number(this.Lines[key].NewPrior_tp);						
					}
					
					var uniqueArray = this.transaction.removeDuplicates(this.Lines, "CostCode_tp");					
					if(uniqueArray.length > 1){
						this.MultipleCC = true;
					}
					//this.PriorRetainage = Number(this.TotalPriorBilling) * this.RetainageRate;

					this.billForm.get('billNumber').setValue(item.InvoiceNumber_tp);
					this.billForm.get('billDate').setValue(item.BillDate_tp);
					this.billForm.get('billThroughDate').setValue(item.ThroughDate_tp);
					this.billForm.get('billCareOf').setValue(item.CareOf_tp);
					this.billForm.get('billDescription').setValue(item.Notes_tp);
					this.billForm.get('billTaxName').setValue(item.TaxVenueName_tp);
					this.billForm.get('billTax').setValue(this.transaction.getCurrency(item.TaxVenueAmount_tp));
					this.billForm.get('billValueTaxName').setValue(item.VATVenueName_tp);
					this.billForm.get('billValueTax').setValue(this.transaction.getCurrency(item.VATVenueAmount_tp));
					this.billForm.get('billThisPeriodBilling').setValue(item.ThisPeriodBilling_tp);
					this.billForm.get('billTotalContractValue').setValue(this.TotalContractValue);
					this.billForm.get('billTotalPriorBilling').setValue(this.TotalPriorBilling);
					this.billForm.get('billTotalCompletedStored').setValue(item.TotalCompletedStored_tp);
					this.billForm.get('billPriorRetainage').setValue(this.PriorRetainage);
					this.billForm.get('billTotalRetainage').setValue(item.TotalRetainage_tp);
					this.billForm.get('billTotalRetainagePercent').setValue(item.TotalRetainagePercent_tp);
					this.billForm.get('billCurrentRetainage').setValue(this.transaction.getCurrency(item.CurrentRetainage_tp));
					this.billForm.get('billNetAmountDue').setValue(item.NetAmountDue_tp);
					this.billForm.get('billStatus').setValue(item.Status_tp);
					this.billForm.get('billID').setValue(item.PK_TransactionDetailId_tp);
					this.billForm.get('warningRetainage').setValue(item.WarningRetainageStatus_tp);
					this.billForm.get('DisputedRetainage').setValue(item.FK_DisputedRetainage_tp);
					this.billForm.get('DisputedTax').setValue(item.FK_DisputedTax_tp);
					this.billForm.get('DisputedVAT').setValue(item.FK_DisputedVAT_tp);
					this.billForm.get('billTerms').setValue(item.TermsConditions_tp == 1 ? true: false);
					this.billForm.get('billTermsContent').setValue(item.TermsConditionsContent_tp);

					this.TaxVenueName = item.TaxVenueName_tp;
					this.VATVenueName = item.VATVenueName_tp;
					this.ThisPeriodBilling = item.ThisPeriodBilling_tp;
					this.NetAmountDue = item.NetAmountDue_tp;
					//this.TotalContractValue = item.TotalContractValue_tp;
					this.TotalCompletedStored = Number(this.TotalPriorBilling) + Number(this.ThisPeriodBilling);
					this.BoTypeCanadianTaxability = item.rtBoTypeCanadianTaxability_tp.toUpperCase();
					this.BoTypeTaxability = item.rtBoTypeTaxability_tp.toUpperCase();
					this.BoTypeRetainage = item.rtBoTypeRetainage_tp.toUpperCase();
					this.WarningRetainage = item.WarningRetainageStatus_tp;

					this.setBillLines();

					let seqBillNumber = this.transaction.BillNumber();

					seqBillNumber.subscribe((res: any) => {
						this.loadingControl('dismiss', loading);
						this.TotalBills = res[1][0].TotalBills;

						let seqBillAttachments = this.transaction.BillAttachments();

						seqBillAttachments.subscribe((resp: any) => {
							this.loadingControl('dismiss', loading);
							this.attachItems = resp[0];
							this.TotalAttachBills = resp[1][0].TotalBillAttachs;

						}), (err) => {
							this.doToast(this.CONNECTION_ERROR);
							this.loadingControl('dismiss', loading);
						}
					}), (err) => {
						this.doToast(this.CONNECTION_ERROR);
						this.loadingControl('dismiss', loading);
					}

				}), (err) => {
					this.doToast(this.CONNECTION_ERROR);
					this.loadingControl('dismiss', loading);
				}

			}), (err) => {
				this.doToast(this.CONNECTION_ERROR);
				//this.loadingControl('dismiss', loading);
			};

		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
			this.loadingControl('dismiss', loading);
		}
	}

	openAttach(item) {
		let openview
		openview = this.constant.urlTPUploads + item.uploadfolder + '/' + item.filename

		window.open(encodeURI(openview), "_system", "location=yes");
	}

	setBillLines() {
		let control = <FormArray>this.billForm.controls.billLines;
		this.Lines.forEach((line, index: number) => {
			control.push(this.createItem(line,index))
		});
	}	

	createItem(line, index: number): FormGroup {
		return this.fb.group({
			rowNumber: index,
			BOLineID: line.rtBuyoutLineId_tp,
			TO_Mod: line.Scope_tp,
			boLineCstcde: line.CostCode_tp,
			PrtTitle: line.Description_tp,
			Taxable: line.IsTaxable_tp,
			Open: 0,
			Prior: this.transaction.getCurrency(line.NewPrior_tp),
			UnitCost: line.UnitCost_tp,
			CompletedToDate: line.CompletedToDate_tp,
			PresentlyStored: line.PresentlyStored_tp,
			PriorCompletedToDate: line.NewPriorCompletedToDate_tp,
			CompletedStored: line.CompletedStored_tp,
			ThisPeriod: this.transaction.getCurrency(line.ChangeInProgress_tp),
			AcumulativeComplete: line.AcumulativeComplete_tp,
			CurrentOpen: line.Open_tp,
			ChangeInTax: line.ChangeInTax_tp,
			EnterProgress: line.EnterProgress_tp,
			EnterPeriod: line.EnterPeriod_tp,
			Status: true,
			DisputedId: line.FK_DisputedId_tp
		});
	}

	ResetBillLines() {
		let control = <FormArray>this.billForm.controls.billLines;
		this.LinesReset.forEach((line, index: number) => {
			control.setControl(index, this.UpdateItem(line,index))
		});
	}

	UpdateItem(line, index: number): FormGroup {
		return this.fb.group({
			rowNumber: index,
			BOLineID: line.BoLinesID,
			TO_Mod: line.TO_Mod,
			boLineCstcde: line.boLineCstcde,
			PrtTitle: line.PrtTitle,
			Taxable: line.TaxableBill,
			Open: line.Open,
			Prior: this.transaction.getCurrency(line.Prior),
			UnitCost: line.Extttl,
			CompletedToDate: 0,
			PriorCompletedToDate: line.PriorCompletedToDate,
			PresentlyStored: line.PriorPresentlyStored,
			CompletedStored: line.PriorCompletedToDate + line.PriorPresentlyStored,
			ThisPeriod: this.transaction.getCurrency(0),
			AcumulativeComplete: ((this.transaction.getNumber(0) + Number(line.Prior)) / Number(line.Extttl)) * 100,
			CurrentOpen: line.Open,
			ChangeInTax: 0,
			EnterProgress: 'amount',
			EnterPeriod: 'amount',
			Status: false,
			DisputedId: line.FK_DisputedId_tp
		});
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
			loading.dismiss().catch(()=>{});
		}
	}

	openModalPrior(line, i) {
		if (!this.ContentDisabled) {
			const myModalOptions: ModalOptions = {
				enableBackdropDismiss: false
			};

			const myModalData = line;
			const myModal: Modal = this.modal.create('ModalPagePrior', { data: myModalData, line: i }, myModalOptions);
			let loading = this.loadingCtrl.create({
				spinner: 'hide',
				content: `<div class="spinner-loading"> 
					  <div class="loading-bar"></div>
					  <div class="loading-bar"></div>
					  <div class="loading-bar"></div>
					  <div class="loading-bar"></div>
					</div>` + this.LOADING_MESSAGE
			});

			if (line.TO_Mod.value == '00') {
				myModal.present();
			} else {
				this.loadingControl('start', loading);
				let seq = this.transaction.BillLineValidate(Number(line.BOLineID.value))

				seq.subscribe((resp: any) => {
					if (resp[0][0].Status == 'Committed') {
						this.showAlert(this.BILL_WARNING_LINE_STATUS);
					} else {
						myModal.present();
					}
					this.loadingControl('dismiss', loading);
				}, (err) => {
					this.doToast(this.CONNECTION_ERROR);
					this.loadingControl('dismiss', loading);
				});
			}
		}
	}

	openModalProgress(line, i) {

		if (!this.ContentDisabled) {
			const myModalOptions: ModalOptions = {
				enableBackdropDismiss: false
			};

			const myModalData = line;
			let PreferenceBillingModal = this.billForm.get('PreferenceBilling').value;
			const myModal: Modal = this.modal.create('ModalPageProgress', { 
				data: myModalData, 
				line: i, 
				TotalBills: this.TotalBills, 
				PreferenceBilling: PreferenceBillingModal,
				IsCompanySage300: this.IsCompanySage300,
				Alias: this.Alias 
			}, myModalOptions);
			let loading = this.loadingCtrl.create({
				spinner: 'hide',
				content: `<div class="spinner-loading"> 
					  <div class="loading-bar"></div>
					  <div class="loading-bar"></div>
					  <div class="loading-bar"></div>
					  <div class="loading-bar"></div>
					</div>` + this.LOADING_MESSAGE
			});

			if (line.TO_Mod.value == '00') {
				myModal.present();
			} else {
				this.loadingControl('start', loading);
				let seq = this.transaction.BillLineValidate(Number(line.BOLineID.value))

				seq.subscribe((resp: any) => {
					if (resp[0][0].Status == 'Committed') {
						this.showAlert(this.BILL_WARNING_LINE_STATUS);
					} else {
						myModal.present();
					}
					this.loadingControl('dismiss', loading);
				}, (err) => {
					this.doToast(this.CONNECTION_ERROR);
					this.loadingControl('dismiss', loading);
				});
			}

			myModal.onWillDismiss((data) => {
				if (data) {
					let line = this.filterBill
					line[data.Line].get('CompletedToDate').setValue(data.CompletedToDate);
					line[data.Line].get('PresentlyStored').setValue(data.PresentlyStored);
					line[data.Line].get('CompletedStored').setValue(data.CompletedStored);
					line[data.Line].get('ThisPeriod').setValue(data.ThisPeriod);
					line[data.Line].get('AcumulativeComplete').setValue(data.AcumulativeComplete);
					line[data.Line].get('CurrentOpen').setValue(data.CurrentOpen);
					line[data.Line].get('EnterProgress').setValue(data.EnterProgress);
					line[data.Line].get('EnterPeriod').setValue(data.EnterPeriod);
					line[data.Line].get('Status').setValue(data.Status);

					this.billForm.get('PreferenceBilling').setValue(data.PreferenceBilling);

					let progressBilling = 0;
					let lines = this.filterBill;
					for (var j in lines) {
						progressBilling += this.transaction.getNumber(lines[j].controls.ThisPeriod.value);
					}

					this.ThisPeriodBilling = progressBilling.toFixed(2);
					this.TotalCompletedStored = Number(this.TotalPriorBilling) + Number(this.ThisPeriodBilling);

					this.billForm.get('billThisPeriodBilling').setValue(this.ThisPeriodBilling);
					this.billForm.get('billTotalCompletedStored').setValue(this.TotalCompletedStored);

					//RETURN CURRENT RETAINAGE $0.00					    
					this.ResetRetainage();	
					
					//SET TAXES
					this.billForm.get('billTax').setValue(this.transaction.getCurrency(0));
					this.billForm.get('billValueTax').setValue(this.transaction.getCurrency(0));
					line[data.Line].get('ThisPeriod').setValue(this.transaction.getCurrency(data.ThisPeriod));

					//Calculate NET AMOUNT DUE
					this.CalculateNetAmountDue();
				}
			});
		}
	}

	openModalRetainage() {
		if (!this.ContentDisabled) {
			const myModalOptions: ModalOptions = {
				enableBackdropDismiss: false
			};

			if (this.WarningRetainage == 1) {
				this.RetainageRate = this.TempRetainageRate;
			}

			const myModalData = {
				TotalContractValue: this.TotalContractValue,
				TotalPriorBilling: this.TotalPriorBilling,
				ThisPeriodBilling: this.ThisPeriodBilling,
				TotalCompletedStored: this.TotalCompletedStored,
				PriorRetainage: this.PriorRetainage,
				TotalRetainage: Number(this.billForm.get('billTotalRetainage').value),
				TotalRetainagePercent: Number(this.billForm.get('billTotalRetainagePercent').value),
				CurrentRetainage: this.transaction.getNumber(this.billForm.get('billCurrentRetainage').value),
				RetainageRate: this.RetainageRate,
				CurrentRetainageStatus: this.billForm.get('billCurrentRetainageStatus').value,
				WarningRetainage: this.WarningRetainage,
				IsCompanySage100: this.IsCompanySage100,
				IsCompanySage300: this.IsCompanySage300,
				Alias: this.Alias
			};
			const myModal: Modal = this.modal.create('ModalPageRetainage', { data: myModalData }, myModalOptions);
			myModal.present();

			myModal.onWillDismiss((data) => {
				if (data) {					
					//SAGE 300
					if(this.IsCompanySage300 == 'YES' && this.Alias != ''){      
						this.ResetProgress();	
					}

					this.billForm.get('billCurrentRetainageStatus').setValue(data.CurrentRetainageStatus);
					this.billForm.get('billTotalRetainage').setValue(data.TotalRetainage);
					this.billForm.get('billTotalRetainagePercent').setValue(data.TotalRetainagePercent);
					this.billForm.get('billCurrentRetainage').setValue(data.CurrentRetainage);

					//Calculate NET AMOUNT DUE
					this.CalculateNetAmountDue();
					this.billForm.get('billCurrentRetainage').setValue(this.transaction.getCurrency(data.CurrentRetainage));

					//New Current Retainage
					this.WarningRetainage = data.WarningRetainage;
				}
			});
		}
	}

	onChangeTax() {
		let ExistsTaxable = this.ValidateIsTaxable();

		//Calculate NET AMOUNT DUE
		this.CalculateNetAmountDue();

		//ALERT TAX VALIDATION
		if (!ExistsTaxable) {
			this.showAlert('You can\'t add tax ...');
		}

		let Tax = this.transaction.getNumber(this.billForm.get('billTax').value);
		let lines = this.filterBill;
		let ThisPeriodBillingTaxable = 0;

		//CALCULATE THIS_PERIOD_BILLING FOR TAXABLES
		for (var i in lines) {
			if (lines[i].controls.Taxable.value) {
				let ThisPeriod = this.transaction.getNumber(lines[i].get('ThisPeriod').value);
				ThisPeriodBillingTaxable += ThisPeriod;
			};
		}

		//CALCULATE CHANGEINTAX
		for (var j in lines) {
			if (lines[j].controls.Taxable.value) {
				if (ThisPeriodBillingTaxable == 0) {
					lines[j].get('ChangeInTax').setValue(0);
				} else {
					let ThisPeriod = this.transaction.getNumber(lines[j].get('ThisPeriod').value);
					let ChangeInTax = Number((ThisPeriod / ThisPeriodBillingTaxable) * Tax).toFixed(8);
					lines[j].get('ChangeInTax').setValue(ChangeInTax);
				}
			};
		}

		this.billForm.get('billTax').setValue(this.transaction.getCurrency(Tax));
	}

	onChangeValueTax() {
		let ExistsTaxable = this.ValidateIsTaxable();

		//Calculate NET AMOUNT DUE
		this.CalculateNetAmountDue();

		//ALERT TAX VALIDATION
		if (!ExistsTaxable) {
			this.showAlert('You can\'t add tax ...');
		}

		let ValueTax = this.transaction.getNumber(this.billForm.get('billValueTax').value);
		this.billForm.get('billValueTax').setValue(this.transaction.getCurrency(ValueTax));
	}

	CalculateNetAmountDue() {
		let CurrentRetainage = 0;
		let Tax = 0;
		let ValueTax = 0;
		let ThisPeriodBilling = Number(this.ThisPeriodBilling);

		if (this.BoTypeRetainage == 'YES') {
			CurrentRetainage = this.transaction.getNumber(this.billForm.get('billCurrentRetainage').value);
		}

		if (this.BoTypeTaxability == 'YES') {
			Tax = this.transaction.getNumber(this.billForm.get('billTax').value);
		}

		if (this.BoTypeRetainage == 'YES') {
			ValueTax = this.transaction.getNumber(this.billForm.get('billValueTax').value);
		}

		this.NetAmountDue = ThisPeriodBilling - CurrentRetainage + Tax + ValueTax;
		this.billForm.get('billNetAmountDue').setValue(this.NetAmountDue);
	}

	ValidateIsTaxable() {
		let lines = this.filterBill;
		for (var key in lines) {
			if (lines[key].controls.Taxable.value && this.transaction.getNumber(lines[key].controls.ThisPeriod.value) > 0) {
				return true;
			};
		}

		//SET TAXES
		this.billForm.get('billTax').setValue(this.transaction.getCurrency(0));
		this.billForm.get('billValueTax').setValue(this.transaction.getCurrency(0));

		return false;
	}

	showAlert(message: string) {
		const alert = this.alertCtrl.create({
			title: 'Warning!',
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();
	}

	showAlertCustomButton(message: string, buttonText: string) {
		const alert = this.alertCtrl.create({
			title: 'Warning!',
			subTitle: message,
			buttons: [buttonText]
		});
		alert.present();
	}

	showConfirm(message: string) {
		const confirm = this.alertCtrl.create({
			title: this.BILL_SUCCESS_TITLE,
			message: message,
			buttons: [
				{
					text: 'Ok',
					handler: () => {
						this.user._refreshpage = "true";
						this.navCtrl.pop();
					}
				}
			],
			enableBackdropDismiss: false
		});
		confirm.present();
	}

	WarningTaxes(message: string) {
		if (!this.ContentDisabled) {
			const toast = this.toastCtrl.create({
				message: message,
				duration: 3000,
				position: 'bottom'
			});
			toast.present();
		}
	}

	preOnSubmit(type: string) {
		let loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<div class="spinner-loading"> 
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				  <div class="loading-bar"></div>
				</div>` + this.LOADING_MESSAGE
		});

		//Verify New Retainage
		if (this.WarningRetainage == 1) {
			this.doToast(this.BILL_WARNING_NEW_RETAINAGE.replace("{{retainage}}", this.transaction.getPercent(this.TempRetainageRate)));
			return;
		} else {
			this.billForm.get('warningRetainage').setValue(this.WarningRetainage);
		}

		this.loadingControl('start', loading);

		let seqOpenCommitment = this.transaction.OpenCommitment(1);

		seqOpenCommitment.subscribe((res: any) => {
			let CurrentOpenCommitment: Number;
			let TotalProgress: any;

			if (this.TotalBills == 0) {
				CurrentOpenCommitment = Number(this.TotalContractValue) - Number(this.ThisPeriodBilling);
			} else {
				TotalProgress = (Number(res[0].TotalChangeInProgress) + Number(this.ThisPeriodBilling)).toFixed(2);
				CurrentOpenCommitment = Number(this.TotalContractValue) - Number(TotalProgress);
			}
			//console.log(TotalProgress)

			if (CurrentOpenCommitment < 0) {
				this.loadingControl('dismiss', loading);
				this.showAlert(this.BILL_WARNING_OPEN_COMMITMENT);
			} else {
				let seqEditValidate = this.transaction.EditBillValidate();

				seqEditValidate.subscribe((res: any) => {

					let BillsInDraft = res[0].BillInDraft;
					if (BillsInDraft == 0) {
						this.loadingControl('dismiss', loading);
						this.showValidate('Bill already was submitted!');
					} else {
						let seqValidate = this.transaction.VendorInvoiceValidate();

						seqValidate.subscribe((res: any) => {

							let InvoicesInDraft = res[0][0].InvoicesInDraft;
							let CommitmentStatus = res[1][0].Status;
							let FreeApps = res[2][0].FreeApps;

							if (FreeApps.toLowerCase() == "yes") {
								this.afterValidate(InvoicesInDraft, CommitmentStatus, type, loading, false);
							} else if (FreeApps.toLowerCase() == "no") {

								let seqeapps = this.transaction.GetPurchaseEapps(Number(this.user._usercompanyid), 0)

								seqeapps.subscribe((resp: any) => {
									if (resp.eAppsTotal > 0) {
										this.afterValidate(InvoicesInDraft, CommitmentStatus, type, loading, true)

									} else {
										this.loadingControl('dismiss', loading);
										this.showAlert(this.BILL_WARNING_NEED_EAPPS);
									}
								}, (err) => {
									this.loadingControl('dismiss', loading);
									this.doToast(this.CONNECTION_ERROR);
								});
							}

						}), (err) => {
							this.loadingControl('dismiss', loading);
							this.doToast(this.CONNECTION_ERROR);
						};
					}

				}), (err) => {
					this.doToast(this.CONNECTION_ERROR);
					this.loadingControl('dismiss', loading);
				}
			}
		}), (err) => {
			this.loadingControl('dismiss', loading);
			this.doToast(this.CONNECTION_ERROR);
		};;
	}

	afterValidate(InvoicesInDraft, CommitmentStatus, type, loading, discounteapps) {

		if (InvoicesInDraft == 0 && CommitmentStatus == "Executed") {
			this.loadingControl('dismiss', loading);
			this.onSubmit(type, discounteapps);
		} else {
			this.loadingControl('dismiss', loading);
			if (InvoicesInDraft > 0) {
				this.showAlert('There is already a Draft Vendor Invoice for this Commitment. You must commit the current Draft Vendor Invoice before adding a new Vendor Invoice.');
			}

			if (CommitmentStatus != "Executed") {
				this.showAlert(this.BILL_WARNING_COMMITMENT_STATUS);
			}
		}

	}

	onSubmit(type: string, discounteapps: boolean) {

		//Verify Bill and Through Dates + New Retainage 
		if (type == 'Draft') {	
			var dateFormatValid = 'DD-MM-YYYY';
			var isValidBillDate = moment(moment(this.billForm.get('billDate').value).format(dateFormatValid),dateFormatValid,true).isValid();
			var isValidThroughDate = moment(moment(this.billForm.get('billThroughDate').value).format(dateFormatValid),dateFormatValid,true).isValid();

			if(!isValidBillDate || !isValidThroughDate){
				this.showAlertCustomButton('Confirm you are using a valid Date and try again.','ACCEPT');				
				return;
			}			

			if (this.WarningRetainage == 1) {
				this.doToast(this.BILL_WARNING_NEW_RETAINAGE.replace("{{retainage}}", this.transaction.getPercent(this.TempRetainageRate)));
				return;
			} else {
				this.billForm.get('warningRetainage').setValue(this.WarningRetainage);
			}
		}

		//DESCRIPTION IS REQUIRED
		for (let k = 0; k <= this.attachItems.length - 1; k++) {
			//console.log(this.attachItems[k].description);
			if (this.attachItems[k].description == "") {
				this.doToast(this.BILL_WARNING_ATTACH_DESCRIPTION);
				return;
			}
		}

		for (let l = 0; l <= this.attachNewItems.length - 1; l++) {
			//console.log(this.attachNewItems[l].description);
			if (this.attachNewItems[l].description == "") {
				this.doToast(this.BILL_WARNING_ATTACH_DESCRIPTION);
				return;
			}
		}


		if (Number(this.billForm.get('billNetAmountDue').value) == 0 && type != 'Draft') {
			this.doToast(this.BILL_WARNING_BILL_ZERO);
			return;
		}

		let that = this;
		this.billForm.get('billStatus').setValue(type);
		let fileName = 'Bill-' + this.billForm.get('billNumber').value + '-' + this.project._projectnumber + '-' + this.project._projectscope + '-' + this.today + '.pdf'

		fileName = fileName.replace(/[\/\\:*?"<>|#]/g, '-');
		this.billForm.get('billFilename').setValue(fileName);


		if (type == 'Submitted') {
			if (this.billForm.get('billDescription').value == "") {
				this.billForm.get('billDescription').setValue(this.BILL_DESCRIPTION_DEFAULT);
			}
			this.billForm.get('billTermsContent').setValue(this.VendorCertification);

			let timeZone = moment.tz.guess();
			let time = new Date();
			let dateFormat = this.project._rtDateformat;
			let submittedDateLocale = moment.tz(time,timeZone).format(dateFormat.toUpperCase() + ' h:mm:ss A z');			
			
			this.billForm.get('billSubmittedDateLocale').setValue(submittedDateLocale);
			this.billForm.get('billSubmittedTimezone').setValue(timeZone);
		}

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

		let seqvalidate = this.transaction.VerifyTransactionStatus();

		seqvalidate.subscribe((resv: any) => {
			let TransactionStatus = resv[0].TransactionStatus;
			let IsTeamPlayerInvoice = resv[0].IsTeamPlayerInvoice.toUpperCase();

			if (IsTeamPlayerInvoice == 'NO' && type == 'Submitted') {
				this.loadingControl('dismiss', loading);
				this.showAlert(this.BILL_WARNING_TEAMPLAYERINVOICE);
				return;
			}

			if (TransactionStatus == "Closed") {
				this.loadingControl('dismiss', loading);
				this.translate.get(['CONTRACT_WARNING_CLOSED_STATUS']).subscribe((value) => {
					this.doToast(value.CONTRACT_WARNING_CLOSED_STATUS);
				});
			} else {
				let seq = this.transaction.UpdateBill(this.billForm.value);

				seq.subscribe((res: any) => {

					that.user._preferencebilling = this.billForm.get('PreferenceBilling').value;

					for (let i = 0; i <= this.attachItems.length - 1; i++) {
						this.transaction.UpdateDescAttachment(this.attachItems[i])
					}

					for (let i = 0; i <= this.attachNewItems.length - 1; i++) {
						this.TotalAttachBills = this.TotalAttachBills + 1;
						this.uploadAttachment(this.attachNewItems[i], this.TotalAttachBills)
						this.insertUploadAttachment(this.attachNewItems[i], this.TotalAttachBills)
					}

					if (type == 'Submitted') {
						let seqAux = this.transaction.SubmitVendorInvoice(this.billForm.value);

						seqAux.subscribe((res: any) => {
							let invoiceid = res[0].VendorInvoiceID;
							let seqRoute = this.transaction.Route(invoiceid);

							seqRoute.subscribe((res: any) => {
								let seqPDF = this.transaction.GenericWebGeneratePDF(fileName, "Billing", invoiceid);

								seqPDF.subscribe((res: any) => {
									this.loadingControl('dismiss', loading);
									this.showConfirm(this.BILL_SUCCESS_MESSAGE);

									if (discounteapps) {
										this.discounteApps();
									} else {
										let invoicenumber = this.billForm.get('billNumber').value
										this.insertFreeApps(invoiceid, invoicenumber);
									}
								}), (err) => {
									this.loadingControl('dismiss', loading);
									this.doToast(this.CONNECTION_ERROR);
								};
							}), (err) => {
								this.loadingControl('dismiss', loading);
								this.doToast(this.CONNECTION_ERROR);
							};

						}), (err) => {
							this.loadingControl('dismiss', loading);
							this.doToast(this.CONNECTION_ERROR);
						}
					} else {
						let seqPDF = this.transaction.GenericWebGeneratePDF(fileName, "Billing", '');

						seqPDF.subscribe((res: any) => {
							this.loadingControl('dismiss', loading);
							this.showConfirm(this.BILL_WARNING_SUCCESS_DRAFT);

							if (discounteapps) {
								this.discounteApps();
							}
						}), (err) => {
							this.loadingControl('dismiss', loading);
							this.doToast(this.CONNECTION_ERROR);
						};
					}

				}), (err) => {
					this.loadingControl('dismiss', loading);
					this.doToast(this.CONNECTION_ERROR);
				}
			}
		}), (err) => {
			this.loadingControl('dismiss', loading);
			this.doToast(this.CONNECTION_ERROR);
		}
	}

	showValidate(message: string) {
		const confirm = this.alertCtrl.create({
			title: 'Warning!',
			message: message,
			buttons: [
				{
					text: 'Ok',
					handler: () => {
						this.navCtrl.push("ListBillingPage");
					}
				}
			]
		});
		confirm.present();
	}

	discounteApps() {
		let seqCoin = this.transaction.discounteApps();

		seqCoin.subscribe((res: any) => {
			this.sendMessage({ user: this.user._useremail, room: this.user._usercompanyid, message: "purchase+" });
			this.leaveRoom({ user: this.user._useremail, room: this.user._usercompanyid });
		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
		};
	}

	insertFreeApps(invoiceid: number, invoicenumber: string) {

		let seqCoin = this.transaction.InsertFreeApps(invoiceid, invoicenumber);

		seqCoin.subscribe((res: any) => {

		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
		};
	}

	@ViewChild('PickerBillDate') PickerBillDate;
	openBillDate() {
		if (!this.ContentDisabled) {
			this.PickerBillDate.open();
		}
	}

	@ViewChild('PickerThroughDate') PickerThroughDate;
	openThroughDate() {
		if (!this.ContentDisabled) {
			this.PickerThroughDate.open();
		}
	}

	onClose() {
		if (this.ContentDisabled) {
			this.navCtrl.push("ListBillingPage");
		}
	}

	showConfirmRetainage() {

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
		
		//Verify Bill and Through Dates
		var dateFormatValid = 'DD-MM-YYYY';
		var isValidBillDate = moment(moment(this.billForm.get('billDate').value).format(dateFormatValid),dateFormatValid,true).isValid();
		var isValidThroughDate = moment(moment(this.billForm.get('billThroughDate').value).format(dateFormatValid),dateFormatValid,true).isValid();

		if(!isValidBillDate || !isValidThroughDate){
			this.showAlertCustomButton('Confirm you are using a valid Date and try again.','ACCEPT');
			this.loadingControl('dismiss', loading);
			return;
		}			

		let seqvalidate = this.transaction.VerifyTransactionStatus();

		seqvalidate.subscribe((resv: any) => {
			this.loadingControl('dismiss', loading);
			let TransactionStatus = resv[0].TransactionStatus;
			if (TransactionStatus == "Closed") {
				this.translate.get(['CONTRACT_WARNING_CLOSED_STATUS']).subscribe((value) => {
					this.doToast(value.CONTRACT_WARNING_CLOSED_STATUS);
				});
			} else {
				let CurrentRetainage = 0;
				CurrentRetainage = this.transaction.getNumber(this.billForm.get('billCurrentRetainage').value);

				if (CurrentRetainage == 0) {
					const confirmRetainage = this.alertCtrl.create({
						title: this.BILL_WARNING_RETAINAGE_ZERO_TITLE,
						message: this.BILL_WARNING_RETAINAGE_ZERO,
						buttons: [
							{
								text: this.CANCEL_BUTTON,
								handler: () => {
								}
							},
							{
								text: this.CONFIRM_BUTTON,
								handler: () => {
									this.preOnSubmit('Submitted');
								}
							}
						]
					});
					confirmRetainage.present();
				} else {
					this.preOnSubmit('Submitted');
				}
			}
		}), (err) => {
			this.loadingControl('dismiss', loading);
			this.doToast(this.CONNECTION_ERROR);
		}
	}

	FocusDescription(i: any) {
		const el = document.querySelector('#filedescription' + i);
		//console.log(el);
		el.classList.add('focus-description');
	}

	BlurDescription(i: any) {
		const el = document.querySelector('#filedescription' + i);
		//console.log(el);
		el.classList.remove('focus-description');
	}

	newFocusDescription(i: any) {
		const el = document.querySelector('#newfiledescription' + i);
		//console.log(el);
		el.classList.add('focus-description');
	}

	newBlurDescription(i: any) {
		const el = document.querySelector('#newfiledescription' + i);
		//console.log(el);
		el.classList.remove('focus-description');
	}

	resize(i: any) {
		const ta = this.element.nativeElement.querySelector('#txtdescription' + i);
		//const el = document.querySelector('#txtdescription'+i);
		ta.style.height = 'auto'
		ta.style.height = ta.scrollHeight + 'px';
	}

	newResize(i: any) {
		const ta = this.element.nativeElement.querySelector('#newtxtdescription' + i);
		//const el = document.querySelector('#txtdescription'+i);
		ta.style.height = 'auto'
		ta.style.height = ta.scrollHeight + 'px';
	}

	adjust() {
		for (let i = 0; i <= this.attachItems.length - 1; i++) {
			const ta = this.element.nativeElement.querySelector('#txtdescription' + i);
			//const el = document.querySelector('#txtdescription'+i);
			ta.style.height = 'auto'
			ta.style.height = ta.scrollHeight + 'px';
		}
	}

	dosomething(value: any) {
		console.log(value)
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

	openView(item: Item) {
		let openview: string;
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
	}

	async preview(fab: FabContainer) {
		this.closeOptions(fab);
		const transactionDetailId = this.transaction._transactiondetailid;
		const billDetailsRequest = await this.transaction.BillDetails().toPromise();
		const billDetailResponse = billDetailsRequest[0][0];
		const billAttachName: string = billDetailResponse.AttachmentName_tp;
		const billStatus: string = billDetailResponse.Status_tp;
		const billOptionsRequest = await this.transaction.BillOptions(transactionDetailId).toPromise();
		const billObject = {
			TransactionDetailId: transactionDetailId,
			AttachName: billAttachName,
			Status: billStatus,
			ReviseBill: billOptionsRequest[0].ReviseThisBill.toUpperCase(),
		} 
		this.openView(billObject);
	}

	get filterBill(): any {
		const lines = this.billForm.controls.billLines.controls;
		if (this.filterModel === 'disputed') {
			return lines.filter(((line: any) => line.value.DisputedId));
		} else if (this.filterModel === 'presently') {
			return lines.filter(((line: any) => line.value.PresentlyStored > 0));
		} else if (this.filterModel === 'under') {
			return lines.filter(((line: any) => {
				const totalAmount = line.value.UnitCost;
				const thisPeriod = parseFloat(line.value.ThisPeriod.replace(/,/g, ''));
				const prior = parseFloat(line.value.Prior.replace(/,/g, ''));
				return thisPeriod + prior < totalAmount;
			}));
		} else {
			return lines;
		}
	}

	get emptyMessage(): string {
		const option = this.filterModel;
		let message: string = 'There are no Items in the Contract to be Billed.';
		if (option === 'disputed') {
			message = 'There are no Disputed Items in this Bill.';
		} else if (option === 'presently') {
			message = 'There are no Items with Presently Stored amounts in this Bill.';
		} else if (option === 'under') {
			message = 'There are no items under 100% Billed.';
		} 
		return message;
	}

	openModalLineDisputed(line, i) {
		//console.log(line)
		const myModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};
		//const myModalData = line;

		const myModalData = {
			DisputedId: line.DisputedId.value,
			AmountDisputed: line.ThisPeriod.value,
			Description: line.PrtTitle.value
		};

		const myModal: Modal = this.modal.create('ModalPageDisputed', { data: myModalData, line: i, type: "ScheduleValue" }, myModalOptions);
		myModal.present();
	}

	openModalDisputed(type) {
		//console.log(bill)
		let DisputedId;
		let AmountDisputed;
		switch (type) {
			case "CurrentRetainage":
				DisputedId = this.billForm.get('DisputedRetainage').value;
				AmountDisputed = this.billForm.get('billCurrentRetainage').value;
				break;
			case "Tax":
				DisputedId = this.billForm.get('DisputedTax').value;
				AmountDisputed = this.billForm.get('billTax').value;
				break;
			case "VAT":
				DisputedId = this.billForm.get('DisputedVAT').value;
				AmountDisputed = this.billForm.get('billValueTax').value;
				break;
		}

		const myModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};

		const myModalData = {
			DisputedId: DisputedId,
			AmountDisputed: AmountDisputed,
			Description: ""
		};

		const myModal: Modal = this.modal.create('ModalPageDisputed', { data: myModalData, line: 0, type: type }, myModalOptions);
		myModal.present();
	}

	OpenTermsConditions() {
		//console.log('open Terms');

		const myModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};

		const myModalData = {
			VendorCertification: this.VendorCertification
		};

		const myModal: Modal = this.modal.create('ModalsTermsConditionsPage', { data: myModalData }, myModalOptions);
		myModal.present();

		myModal.onWillDismiss((data) => {
			//console.log('close Terms')
		});
	}

	ResetProgress() {
		
		this.ResetBillLines();
		this.ThisPeriodBilling = 0.00;
		this.TotalCompletedStored = Number(this.TotalPriorBilling) + Number(this.ThisPeriodBilling);

		this.billForm.get('billThisPeriodBilling').setValue(this.ThisPeriodBilling);
		this.billForm.get('billTotalCompletedStored').setValue(this.TotalCompletedStored);

		//SET TAXES
		this.billForm.get('billTax').setValue(this.transaction.getCurrency(0));
		this.billForm.get('billValueTax').setValue(this.transaction.getCurrency(0));

	}

	ResetRetainage () {

		this.billForm.get('billTotalRetainage').setValue(0);
		this.billForm.get('billTotalRetainagePercent').setValue(0);
		this.billForm.get('billCurrentRetainage').setValue(this.transaction.getCurrency(0));
		this.billForm.get('billCurrentRetainageStatus').setValue(false);	

	}
}
