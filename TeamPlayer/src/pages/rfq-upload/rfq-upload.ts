import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Items } from '../../providers';
//import { IOSFilePicker } from '@ionic-native/file-picker';
import { Platform, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Transaction, User, Project, Constant, Customer } from '../../providers';
import { Item } from '../../models/item';
import { File } from '@ionic-native/file/ngx';
declare var cordova: any;
declare var window;
@IonicPage()
@Component({
	selector: 'page-rfq-upload',
	templateUrl: 'rfq-upload.html'
})
export class RFQUploadPage {

	rfqupload: { amount: string, quotenumber: string, ptid: string, notes: string, days: string } = {
		amount: '',
		quotenumber: '',
		ptid: '',
		notes: '',
		days: ''
	};

	item: any;
	itemdetail: any;
	FileURI: any;
	FileSize: any;
	Filename: any;
	TransactionDate: any;
	today: any;
	daystoexpire: any;
	public attachmentfile = false;
	public showAssemblies = false;
	public QuoteAssemblyDesc: string;
	public FileDescription: string;
	public FileName: string;
	public JobLocation: string;
	public LocationAddress: string;
	public Description: string;
	public Constraints: string;
	public Instructions: string;
	currentAssembly: any;
	currentItems: Item[];
	currentItemsPT: Item[];
	QuotesItems: Item[] = [];
	public QuotesItems2: Item[] = [];

	constructor(public file: File, public transfer: FileTransfer,
		public user: User,
		public project: Project,
		public customer: Customer,
		public constant: Constant,
		public plt: Platform,
		//public filePicker: IOSFilePicker,
		private modal: ModalController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public items: Items,
		public transaction: Transaction,
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

		this.Filename = ""
		this.FileSize = ""
		this.TransactionDate = ""
		this.today = ""
		this.daystoexpire = ""
		this.transaction._attachmentname = ""
		let seqa = transaction.QuoteAssembly();
		let seqpt = transaction.PaymentTerms();

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
			seqa.subscribe((resa: any) => {
				this.currentAssembly = resa;
				this.QuoteAssemblyDesc = this.currentAssembly[0].AssemblyNumber + ' - ' + this.currentAssembly[0].AssemblyDescription;
				let seq = transaction.QuoteScopeLst();
				seq.subscribe((res: any) => {
					this.currentItems = res;
					if (this.currentItems.length > 0) {
						this.showAssemblies = true;
					} else {
						this.showAssemblies = false;
					}

					seqpt.subscribe((resa: any) => {
						this.currentItemsPT = resa;

						this.loadingControl('dismiss', loading)
					});


				});
			});
		})
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

	expandTextexp() {
		let element = document.getElementById("txtDescriptionexp");
		console.log(element)
		element.style.height = element.scrollHeight + "px";
		if (element.nodeValue.length > 1000) element.nodeValue = element.nodeValue.substring(0, 1000);
	}

	GeneratePDF(loading) {

		//companyID (vendorID de tp) - customerID - projectnumber - quotes / vendorinvoices / comitments 
		this.Filename = 'Quote-' + this.rfqupload.quotenumber + '-' + this.project._projectnumber + '-' + this.project._projectscope + '-' + this.transaction._transactionid + '.pdf'
		this.transaction._attachmentname = this.Filename;

		let fileName = this.Filename;

		this.TransactionDate = (new Date((new Date((new Date(new Date())).toISOString())).getTime() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ');

		let date = new Date().toLocaleString('en-US', { hour12: false }).split(" ");

		let formattedDate = date[0];
		formattedDate = formattedDate.substring(0, formattedDate.length - 1);

		let now = new Date(formattedDate);
		let day = ("0" + now.getDate()).slice(-2);
		let month = ("0" + (now.getMonth() + 1)).slice(-2);
		this.today = (month) + "/" + (day) + "/" + now.getFullYear();

		let options = {
			documentSize: 'LETTER',
			type: 'base64'
		};
		let lstquotes = '';
		let pdfhtml = `<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<title>Quote</title>
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}
			#body {  
				width: 850px; 
				height: 1100px;
			} 
			#TermsConditions {
				padding-bottom: 10px;  
			}
			#customerinfo { 
				width: 394px;
		    	padding-right: 20px;
		    	padding-bottom: 20px;
			} 
			#quotetotitle { 
			    margin-top: -3px;
			    text-align: left;  
			}
			#customer { 
				width: 394px;
			    padding-top: 5px; 
			    font-weight: normal; 
			}
			#quotenumber {
				position: absolute;
				left: 472px;
				top: 97px;
				width: 325px; 
				margin-top: -3px;
				text-align: right;  
			}
			#quotedate {
				position: absolute;
				left: 472px;
				top: 134px;
				width: 325px; 
				margin-top: -3px;
				text-align: right;  
			}
			#projectinfo {  
				width: 325px;  
			} 
			.normaldesc {
				padding-top: 4px;
		    	padding-bottom: 20px; 
				font-weight: normal; 
			} 
			#quotedetail{ 
				position: absolute;
				left: 58px;
				top: 244px;
				width: 739px;
			}
			.note { 
				padding-bottom: 30px; 
				text-align: left;  
			}
			#serviceproviderinfo {
				width: 390px;
				position: absolute;
				left: 58px;
				top: 87px; 
				margin-top: -3px;
				text-align: left; 
				font-weight: normal; 
			} 
			#groupdesc {
				box-sizing: border-box;
				border : 1px solid #A1A1A1;  
				padding: 9px;
				width: 739px; 
				background-color: rgba(246,246,246,1);
				height: 37px; 
			}   
			#groupgeneral { 
				page-break-inside: avoid;
				box-sizing: border-box;
			    border-left : 1px solid #A1A1A1;
			    border-right : 1px solid #A1A1A1; 
			    width: 739px;
			    height: 37px;
			    padding: 9px;
			} 
			#grouptotal { 
				display: -webkit-inline-box;
				border-top : 1px solid #A1A1A1; 
				margin-top: -1px;
			}
			#subgrouptotal { 
				width: 531px;
		    	height: 40px;
		    	padding: 7px;
			} 
			#total {  
				text-align: right;  
				font-size: 22px; 
			} 
			#subgrouprecamount {
				width: 194px;
				text-align: right;
				box-sizing: border-box;
				border-left: 1px solid #A1A1A1;  
				border-right: 1px solid #A1A1A1;
				border-bottom: 1px solid #A1A1A1;
				padding: 7px; 
				background-color: rgba(246,246,246,1);
				height: 40px; 
			} 
			#totalamount {    
				font-size: 22px; 
			}
			#groupdetail { 
				page-break-inside: avoid; 
				box-sizing: border-box;
			    border: 1px solid #A1A1A1;
		    	margin-top: -1px;
			    width: 739px;
			    height: 54px;
			    padding: 9px;
			}  
			#detailtitle {
				height: 17px; 
				font-weight: normal; 
				margin-bottom: 3px;
			}
			#detaildesc {
				height: 14px; 
				font-style: italic; 
				font-size: 12px;
				color: rgba(112,112,112,1);
			}
			#serviceprovidertitle {
				position: absolute;
				left: 58px;
				top: 50px;
				line-height: 26px;
				margin-top: -2px;  
				font-size: 22px; 
				width: 500px;
			}
			#quotetitle {
				position: absolute;
				left: 586px;
				top: 50px;
				width: 212px;
				line-height: 26px;
				margin-top: -2px;
				text-align: right;  
				font-size: 22px; 
			}
			#paymentterms { 
				margin-top: -3px;		
				font-weight: normal;
				
			}
			#grouptermsconditions { 
				page-break-inside: avoid;
			    padding-top: 10px;
			}
			#groupfooter{
				position: fixed;
				bottom: 0px;
				left: 58px;
				right: 89px;
			}
			.fontstyle{
				font-family: Roboto;
				font-style: normal;
				font-size: 14px;
				color: rgba(3,4,4,1);
			}
			.fontbold{
				font-weight: bold; 
			}
			.lineheight{
				line-height: 20px;
			}
		</style>
		</head>
		<body>
		<div id="body">
			<div id="serviceprovidertitle" class="fontbold fontstyle">
				<span>` + this.user._companyname + `</span>
			</div>
			<div id="quotetitle" class="fontbold fontstyle">
				<span>QUOTE</span>
			</div> 
			<div id="serviceproviderinfo" class="lineheight fontstyle">
				<span style="">` + this.user._userfirstname + ` ` + this.user._userlastname + `, ` + this.user._userposition + `<br/></span> 
				<span style="">` + this.user._useremail + `<br/>` + this.user._useraddress + `<br/>` + this.user._usercity + ` , ` + this.user._userstateorprovince + ` ` + this.user._userzipcode + `<br/>` + this.user._userphonenumber + `</span>
			</div> 
			<div id="quotenumber" class="lineheight fontbold fontstyle">
				<span style="">Quote #</span>
				<span style="font-style:normal;font-weight:normal;">` + this.rfqupload.quotenumber + `</span>
			</div>
			<div id="quotedate" class="lineheight fontbold fontstyle">
				<span style="">Quote Date</span>
				<span style="font-style:normal;font-weight:normal;">  ` + this.today + `</span>
			</div>
			<div id="quotedetail">
				<div style="display: -webkit-inline-box;">
					<div id="customerinfo">
						<div id="quotetotitle" class="lineheight fontbold fontstyle">
							<span>Quote To</span>
						</div>
						<div id="customer" class="lineheight fontstyle">
							<span>` + this.customer._customername + `<br/>` + this.transaction._requester + `</span>
							<span style="font-style:italic;font-weight:normal;">, ` + this.transaction._requesterposition + `<br/></span>
							<span>` + this.transaction._requesteremail + `<br/></span>
							<span>` + this.customer._address + `<br/>` + this.customer._city + ` , ` + this.customer._stateorprovince + ` ` + this.customer._zipcode + `</span>
						</div>
					</div>
					<div id="projectinfo">
						<div>
							<div class="fontbold lineheight fontstyle">
								<span>Project</span>
							</div>
							<div class="lineheight normaldesc fontstyle">
								<span>` + this.project._projectnumber + ` - ` + this.project._projectname + `</span>
							</div>
						</div>
						<div>
							<div class="fontbold lineheight fontstyle">
								<span>Bid Package</span>
							</div>
							<div class="lineheight normaldesc fontstyle">
								<span>` + this.transaction._subject + `</span>
							</div>
						</div>
					</div>
				</div>`

		if (this.rfqupload.notes != '') {
			pdfhtml = pdfhtml +
				`<div class="lineheight fontbold note fontstyle">
						<span style="">Note -</span>
						<span style="font-style:normal;font-weight:normal;">` + this.rfqupload.notes + `</span>
					</div> `
		}

		pdfhtml = pdfhtml + `<div>`

		if (this.QuotesItems2) {
			if (this.QuotesItems2.length > 0) {
				pdfhtml = pdfhtml +
					`<div id="groupdesc">  
								<div class="fontbold fontstyle">
									<span>DESCRIPTION</span>
								</div> 
							</div>
							<div id="groupgeneral">			 
								<div class="fontbold fontstyle">
									<span>` + this.QuoteAssemblyDesc + `</span>
								</div> 
							</div>`

				for (let i = 0; i <= this.QuotesItems2.length; i++) {
					let quotescoperecord = this.currentItems.find(x => x.woItemID == this.QuotesItems2[i]);
					if (quotescoperecord) {

						lstquotes = lstquotes + ',' + quotescoperecord.woItemID

						pdfhtml = pdfhtml +
							`<div id="groupdetail" >			 
									<div id="detailtitle" class="fontstyle">
										<span>` + quotescoperecord.ItemTitle + `</span>
									</div>
									<div id="detaildesc" class="fontstyle">
										<span>` + quotescoperecord.ItemName + `</span>
									</div>			 
								</div>`
					}
				}

				if (lstquotes != '') {
					lstquotes = lstquotes.substring(1);
				}
			}
		}

		let nf = new Intl.NumberFormat();
		let quoteamount = this.toFixedTrunc(nf.format(Number(this.rfqupload.amount)), 2)
		let PTdescription = ''
		let PTrecord = this.currentItemsPT.find(x => x.PTid == this.rfqupload.ptid);
		if (PTrecord) {
			PTdescription = PTrecord.PTname + ' ' + PTrecord.PTdueDate
		}

		pdfhtml = pdfhtml +
			`<div id="grouptotal">
						<div id="subgrouptotal"> 
							<div id="total" class="fontbold fontstyle">
								<span>Total</span>
							</div>
						</div>
						<div id="subgrouprecamount"> 
							<div id="totalamount" class="fontbold fontstyle">
								<span>$` + quoteamount + `</span>
							</div>
						</div>
					</div>		  
				</div>`
		if (Number(this.rfqupload.days) > 0 || PTdescription != '') {
			pdfhtml = pdfhtml +
				`<div id="grouptermsconditions">
						<div id="TermsConditions" class="fontbold fontstyle">
							<span>Terms & Conditions</span>
						</div>
						<div id="paymentterms" class="lineheight fontstyle"><span>`
			if (Number(this.rfqupload.days) > 0) {
				this.daystoexpire = this.rfqupload.days
				pdfhtml = pdfhtml + `Quote valid for ` + this.daystoexpire + ` days.<br/>`
			}
			if (PTdescription != '') {
				pdfhtml = pdfhtml + PTdescription + ` of quote<br/></span>`
			}
			pdfhtml = pdfhtml + `</div>
					</div>`
		}
		pdfhtml = pdfhtml +
			`</div>
			<div id="groupfooter" class="fontstyle"> 
				<div>
					<span>`+ this.transaction._footer + `</span>
				</div>
			</div>
		</div>
		</body>
		</html>`;

		if (this.plt.is('core')) {
			let seq = this.transaction.WebGeneratePDF(fileName, this.rfqupload.quotenumber,
				this.today,
				this.rfqupload.notes,
				lstquotes,
				this.QuoteAssemblyDesc,
				quoteamount,
				this.daystoexpire,
				PTdescription);
			seq.subscribe((res: any) => {
				this.SubmitQuote(loading)
			});

		} else {
			let that = this;

			cordova.plugins.pdf.fromData(pdfhtml, options)
				.then(function (base64) {
					let contentType = "application/pdf";
					//var folderpath = "file:///storage/emulated/0/Download/";
					let folderpath = cordova.file.externalRootDirectory + "Download/";
					let sliceSize
					contentType = contentType || '';
					sliceSize = sliceSize || 512;
					let byteCharacters = atob(base64);
					let byteArrays = [];
					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						let slice = byteCharacters.slice(offset, offset + sliceSize);
						let byteNumbers = new Array(slice.length);
						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i);
						}
						let byteArray = new Uint8Array(byteNumbers);
						byteArrays.push(byteArray);
					}
					let DataBlob = new Blob(byteArrays, { type: contentType });


					window.resolveLocalFileSystemURL(folderpath, function (dir) {
						dir.getFile(fileName, { create: true }, function (fileEntry) {
							fileEntry.createWriter(function (fileWriter) {
								fileWriter.write(DataBlob);
								//setTimeout(() => {
								// uploadFile; 
								that.uploadFile(loading);
								// }, 3000); 
							}, function () {
								alert('Unable to save file in path ' + folderpath);
							})
						});
					}, function (e) {
						console.log(e)
					})
				})
				.catch((err) => console.log(err));
			//https://www.telerik.com/forums/best-way-to-display-a-pdf-from-base64-string 
		}
	}

	loadingAux(loading) {
		this.loadingControl('dismiss', loading)
		this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
			this.doToast(value.CONNECTION_ERROR);
		})
	}

	uploadFile(loading) {
		let that = this;
		let folderpath = cordova.file.externalRootDirectory + "Download/";
		let fileName = this.Filename
		let urlUploadRT = this.constant.urlUploadRT
		let dbname = this.transaction._dbname
		let tcreate = this.transfer.create();

		window.resolveLocalFileSystemURL(folderpath, function (dir) {
			dir.getFile(fileName, { create: true }, function (fileEntry) {
				let fileUploadUrl = urlUploadRT + '?bdname=' + dbname + '&companyid=' + that.user._usercompanyid + '&customerid=' + that.customer._customerid + '&projectnumber=' + that.project._projectnumber + '&type=QUOTE';
				const fileTransfer: FileTransferObject = tcreate;
				let options: FileUploadOptions = {
					fileKey: "Filedata",
					fileName: fileName,
					chunkedMode: false,
					params: { 'name': fileName }
				}
				fileTransfer.upload(fileEntry.nativeURL, fileUploadUrl, options)
					.then((data) => {
						that.SubmitQuote(loading)
					}, (err) => {
						console.log(err)
						that.loadingAux(loading);
					})
			});
		}, function (e) {
			console.log(e)
		})
	}

	toFixedTrunc(value, n) {
		const v = value.toString().split('.');
		if (n <= 0) return v[0];
		let f = v[1] || '';
		if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
		while (f.length < n) f += '0';
		return `${v[0]}.${f}`
	}

	updateQALst(item: Item) {
		let id = item.woItemID;
		this.QuotesItems.push(id);
		if (this.QuotesItems2.indexOf(id) == -1) {
			this.QuotesItems2.push(id);
		} else {
			this.QuotesItems2.splice(this.QuotesItems2.indexOf(id), 1);
		}
	}

	setOptionsFn() {
		this.rfqupload.ptid = this.rfqupload.ptid
	}

	SubmitQuoteProcess() {

		if (this.rfqupload.quotenumber == '') {
			this.translate.get(['QUOTE_NUMBER_REQUIRED']).subscribe((value) => {
				this.doToast(value.QUOTE_NUMBER_REQUIRED);
			})
		} else if (this.rfqupload.amount == '') {
			this.translate.get(['QUOTE_AMOUNT_REQUIRED']).subscribe((value) => {
				this.doToast(value.QUOTE_AMOUNT_REQUIRED);
			})
		}/*else if(this.rfqupload.ptid == '')
		{
			this.translate.get(['QUOTE_PAYMENT_TERMS_REQUIRED']).subscribe((value) => {
					this.doToast(value.QUOTE_PAYMENT_TERMS_REQUIRED);
				})
		}*/else {
			this.translate.get(['UPLOADING_MESSAGE']).subscribe((value) => {
				let loading = this.loadingCtrl.create({
					spinner: 'hide',
					content: `<div class="spinner-loading"> 
					<div class="loading-bar"></div>
					<div class="loading-bar"></div>
					<div class="loading-bar"></div>
					<div class="loading-bar"></div>
					</div>` + value.UPLOADING_MESSAGE
				});
				this.loadingControl('start', loading)
				this.GeneratePDF(loading)
			})
		}
	}

	SubmitQuote(loading) {

		let userid = this.navParams.get('UserID');
		let facilityid = this.navParams.get('FacilityID');
		let quoteitems = this.QuotesItems2.join();

		let seq = this.transaction.SubmitQuote('SubmitQuote', this.rfqupload.amount, this.Filename, this.FileSize, '.pdf', 'Yes', this.constant.urlEnviroment + '/TS', this.constant.urlLink, userid, 'Submit', quoteitems, facilityid, this.today);
		seq.subscribe((res: any) => {
			let seq2 = this.transaction.UpdateTransaction('Submitted', 'SubmitQuote', this.rfqupload.amount, this.Filename, this.rfqupload.quotenumber, this.TransactionDate, this.daystoexpire, this.rfqupload.ptid, this.rfqupload.notes);
			seq2.subscribe((res: any) => {
				this.loadingControl('dismiss', loading)
				this.user._refreshpage = "true";
				this.user._refreshprevpage = "true";
				this.transaction._amountsubmitted = this.rfqupload.amount;
				this.navCtrl.pop();
			}), (err) => {
				this.loadingControl('dismiss', loading)
				this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
					this.doToast(value.CONNECTION_ERROR);
				})
			}
		}), (err) => {
			this.loadingControl('dismiss', loading)
			this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
				this.doToast(value.CONNECTION_ERROR);
			})
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

	loadingControl(band = '', loading) {
		if (band === 'start') {
			loading.present();
		} else {
			loading.dismiss();
		}
	}
}
