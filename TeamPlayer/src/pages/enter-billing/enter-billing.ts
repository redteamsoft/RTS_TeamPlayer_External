import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
//import { IOSFilePicker } from '@ionic-native/file-picker';
import { Platform, LoadingController, ToastController, Modal, ModalController, ModalOptions, AlertController, Content, FabContainer } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, User, Customer, Project, Constant } from '../../providers';
import { Item } from '../../models/item';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file/ngx';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
import * as moment from 'moment-timezone';
//declare var cordova:any;
//declare var window;
@IonicPage()
@Component({
	selector: 'page-enter-billing',
	templateUrl: 'enter-billing.html'
})
export class EnterBillingPage {
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
	BILL_SUCCESS_TITLE: any;
	BILL_SUCCESS_MESSAGE: any;
	BILL_WARNING_OPEN_COMMITMENT: any;
	BILL_DESCRIPTION_DEFAULT: any;
	BILL_WARNING_SUCCESS_DRAFT: any;
	BILL_WARNING_NEED_EAPPS: any;
	BILL_WARNING_COMMITMENT_STATUS: any;
	BILL_WARNING_LINE_STATUS: any;
	BILL_WARNING_RETAINAGE_ZERO: any;
	BILL_WARNING_RETAINAGE_ZERO_TITLE: any;
	BILL_WARNING_ATTACH_DESCRIPTION: any;
	BILL_WARNING_TEAMPLAYERINVOICE: any;
	CONFIRM_BUTTON: any;
	CANCEL_BUTTON: any;
	today: number = Date.now();
	validate: any;
	TotalBills: number;
	TotalAttachBills: number;
	BoTypeCanadianTaxability: any;
	BoTypeTaxability: any;
	BoTypeRetainage: any;
	IsBrowser: boolean = false;
	IsCompanySage100: any;
	IsCompanySage300: any;
	Alias: any;
	showTools: boolean = false;
	billFilters: Item[];
	filterModel: any;
	VendorCertification: any;
	isNotaryCertification: any;
	NotaryCertification: any;
	isArchitectCertification: any;
	ArchitectCertification: any;
	MultipleCC: boolean = false;

	constructor(public user: User,
		public customer: Customer,
		public project: Project,
		public transfer: FileTransfer,
		public constant: Constant,
		public file: File,
		public plt: Platform,
		//public filePicker: IOSFilePicker,
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

		this.translate.get(['BILL_WARNING_ATTACH_DESCRIPTION']).subscribe((value) => {
			this.BILL_WARNING_ATTACH_DESCRIPTION = value.BILL_WARNING_ATTACH_DESCRIPTION;
		});

		this.translate.get(['CONFIRM_BUTTON']).subscribe((value) => {
			this.CONFIRM_BUTTON = value.CONFIRM_BUTTON;
		});

		this.translate.get(['CANCEL_BUTTON']).subscribe((value) => {
			this.CANCEL_BUTTON = value.CANCEL_BUTTON;
		});

		this.translate.get(['BILL_WARNING_TEAMPLAYERINVOICE']).subscribe((value) => {
			this.BILL_WARNING_TEAMPLAYERINVOICE = value.BILL_WARNING_TEAMPLAYERINVOICE;
		});

		this.joinRoom({ user: this.user._useremail, room: this.user._usercompanyid });
	}

	deleteAttach(item) {
		const index = this.attachItems.indexOf(item, 0);
		if (index > -1) {
			this.attachItems.splice(index, 1);
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
					this.attachItems.push(...data)
				}
			} else {
				if (data) {
					this.attachItems.push(data)
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

			let seq = this.transaction.BillValidate();

			seq.subscribe((res: any) => {
				this.loadingControl('dismiss', loadingAux);
				let BillsInDraft = res[0][0].BillsInDraft;
				if (BillsInDraft > 0) {
					this.showValidate('There is already a Draft Bill for this Contract.');
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
			billTotalContractValue: 0,
			billTotalPriorBilling: 0,
			billThisPeriodBilling: 0,
			billTotalCompletedStored: 0,
			billPriorRetainage: 0,
			billTotalRetainage: 0,
			billTotalRetainagePercent: 0,
			billCurrentRetainage: this.transaction.getCurrency(0),
			billCurrentRetainageStatus: false,
			billTaxName: [],
			billTax: this.transaction.getCurrency(0),
			billValueTaxName: [],
			billValueTax: this.transaction.getCurrency(0),
			billNetAmountDue: 0,
			user: this.user._userid,
			billStatus: ['Draft'],
			projectNumber: this.project._projectnumber,
			projectScope: this.project._projectscope,
			billFilename: [''],
			billBoTypeCanadianTaxability: ['NO'],
			billBoTypeTaxability: ['NO'],
			billBoTypeRetainage: ['NO'],
			dbname: this.transaction._dbname,
			billID: [],
			PreferenceBilling: this.user._preferencebilling,
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

			let seqAux = this.transaction.CommitmentDetails(this.transaction._charsourceid, this.transaction._transactionnumber, this.transaction._dbname);

			seqAux.subscribe((res: any) => {
				this.TaxVenueName = res[0][0].BOSlsTaxName;
				this.VATVenueName = res[0][0].BOSlsCanadianTaxName;
				this.BoTypeCanadianTaxability = res[0][0].BoTypeCanadianTaxability == null ? 'NO' : res[0][0].BoTypeCanadianTaxability.toUpperCase();
				this.BoTypeTaxability = res[0][0].BoTypeTaxability.toUpperCase();
				this.BoTypeRetainage = res[0][0].BoTypeRetainageForm.toUpperCase();
				this.Lines = res[1];
				this.Commitment = res[0][0];
				this.IsCompanySage100 = res[2][0].IsCompanySage100;
				this.IsCompanySage300 = res[2][0].IsCompanySage300;
				this.Alias = res[3][0].Alias;
				this.VendorCertification = res[3][0].VendorCertification;
				this.isNotaryCertification = res[3][0].isNotaryCertification;
				this.NotaryCertification = res[3][0].NotaryCertification;
				this.isArchitectCertification = res[3][0].isArchitectCertification;
				this.ArchitectCertification = res[3][0].ArchitectCertification;

				for (var key in this.Lines) {
					this.TotalPriorBilling += Number(this.Lines[key].Prior);					
				}
				
				var uniqueArray = this.transaction.removeDuplicates(this.Lines, "boLineCstcde");		
				if(uniqueArray.length > 1){
					this.MultipleCC = true;
				}

				this.TotalContractValue = this.Lines[0].SubOrderTotal;
				this.TotalCompletedStored = Number(this.TotalPriorBilling);
				//this.PriorRetainage = Number(this.TotalPriorBilling) * this.RetainageRate;

				this.setBillLines();
				this.TotalAttachBills = 0;
				let seqBillNumber = this.transaction.BillNumber();

				seqBillNumber.subscribe((res: any) => {
					this.loadingControl('dismiss', loading);
					let BillNumberDefault = this.transaction._transactionnumber + "/" + res[0][0].BillNumberDefault;
					this.TotalBills = res[1][0].TotalBills;					

					//SET BILL GLOBAL VALUES			
					this.billForm.get('billTotalContractValue').setValue(this.TotalContractValue);
					this.billForm.get('billTotalPriorBilling').setValue(this.TotalPriorBilling);
					this.billForm.get('billTotalCompletedStored').setValue(this.TotalPriorBilling);
					this.billForm.get('billPriorRetainage').setValue(this.PriorRetainage);
					this.billForm.get('billTaxName').setValue(this.TaxVenueName);
					this.billForm.get('billValueTaxName').setValue(this.VATVenueName);
					this.billForm.get('billBoTypeCanadianTaxability').setValue(this.BoTypeCanadianTaxability);
					this.billForm.get('billBoTypeTaxability').setValue(this.BoTypeTaxability);
					this.billForm.get('billBoTypeRetainage').setValue(this.BoTypeRetainage);
					this.billForm.get('billNumber').setValue(BillNumberDefault);

					if (this.TotalBills > 0) {
						this.RetainageRate = this.TempRetainageRate;
					}
				}), (err) => {
					this.doToast(this.CONNECTION_ERROR);
					this.loadingControl('dismiss', loading);
				}

			}), (err) => {
				this.loadingControl('dismiss', loading);
				this.doToast(this.CONNECTION_ERROR);
			}

		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
			this.loadingControl('dismiss', loading);
		}

	}

	setBillLines() {
		let control = <FormArray>this.billForm.controls.billLines;
		this.Lines.forEach((line, index: number) => {
			control.push(this.createItem(line,index))
		});
	}

	updateBillLines() {
		let control = <FormArray>this.billForm.controls.billLines;
		this.Lines.forEach((line, index: number) => {
			control.setControl(index,this.createItem(line,index))
		});
	}

	createItem(line, index: number): FormGroup {
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
			Status: false
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
			loading.dismiss();
		}
	}

	openModalPrior(line, i) {
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

	openModalProgress(line, i) {
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
				let line = this.filterBill;
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

	openModalRetainage() {
		const myModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};

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
			}
		});
	}

	onChangeTax() {
		let TaxAux = this.transaction.getNumber(this.billForm.get('billTax').value);
		//console.log(ValueTaxAux)
		if (isNaN(TaxAux)) {
			this.billForm.get('billTax').setValue(this.transaction.getCurrency(0));
		}

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
		let ValueTaxAux = this.transaction.getNumber(this.billForm.get('billValueTax').value);
		//console.log(ValueTaxAux)
		if (isNaN(ValueTaxAux)) {
			this.billForm.get('billValueTax').setValue(this.transaction.getCurrency(0));
		}

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
		const toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'bottom'
		});
		toast.present();
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
				let seqValidate = this.transaction.VendorInvoiceValidate();

				seqValidate.subscribe((res: any) => {

					let InvoicesInDraft = res[0][0].InvoicesInDraft;
					let CommitmentStatus = res[1][0].Status;
					let FreeApps = res[2][0].FreeApps;

					if (FreeApps.toLowerCase() == "yes") {
						this.afterValidate(InvoicesInDraft, CommitmentStatus, type, loading, false)
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
		}

		if (Number(this.billForm.get('billNetAmountDue').value) == 0 && type != 'Draft') {
			this.doToast(this.BILL_WARNING_BILL_ZERO);
			return;
		}

		//DESCRIPTION IS REQUIRED
		for (let k = 0; k <= this.attachItems.length - 1; k++) {
			//console.log(this.attachItems[k].description);
			if (this.attachItems[k].description == "") {
				this.doToast(this.BILL_WARNING_ATTACH_DESCRIPTION);
				return;
			}
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

				let seq = this.transaction.SubmitBill(this.billForm.value);

				seq.subscribe((res: any) => {
					this.billForm.get('billID').setValue(res.insertId);
					that.transaction._transactiondetailid = res.insertId;
					that.user._preferencebilling = this.billForm.get('PreferenceBilling').value;

					for (let i = 0; i <= this.attachItems.length - 1; i++) {
						this.TotalAttachBills = this.TotalAttachBills + 1;
						this.uploadAttachment(this.attachItems[i], this.TotalAttachBills);
						this.insertUploadAttachment(this.attachItems[i], this.TotalAttachBills);
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
						this.navCtrl.push("CommitmentDetailPage");
					}
				}
			]
		});
		confirm.present();
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

	@ViewChild('PickerBillDate') PickerBillDate;
	openBillDate() {
		this.PickerBillDate.open();
	}

	@ViewChild('PickerThroughDate') PickerThroughDate;
	openThroughDate() {
		this.PickerThroughDate.open();
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

	resize(i: any) {
		const ta = this.element.nativeElement.querySelector('#txtdescription' + i);
		//const el = document.querySelector('#txtdescription'+i);
		ta.style.height = 'auto'
		ta.style.height = ta.scrollHeight + 'px';
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
		if (this.filterModel === 'disputed') {
			return lines;
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

		this.updateBillLines();
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
