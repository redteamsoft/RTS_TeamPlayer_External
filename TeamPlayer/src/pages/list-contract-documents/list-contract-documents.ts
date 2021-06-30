import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, Refresher, LoadingController, ToastController, AlertController, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Project, Transaction, Constant, User, Customer } from '../../providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
	selector: 'page-contract-documents',
	templateUrl: 'list-contract-documents.html'
})
export class ListContractDocumentsPage {
	public ContentDisabled: boolean
	currentItems: Item[];
	queryText = '';
	lblProjectID = String;
	lblProjectName = String;
	lblTransactionNumber = String; 
	lblcontract: number;
	LOADING_MESSAGE: any;
	CONNECTION_ERROR: any; 
	public olddata: boolean = false;
	TotalBills: number;

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
		public alertCtrl: AlertController) {

		this.ContentDisabled = this.user._ContentDisabled;

		if (this.transaction._olddata == 1)
			this.olddata = true

		this.lblProjectID = this.project._rtProjNum;
		this.lblProjectName = this.project._projectname;
		this.lblTransactionNumber = this.transaction._transactionnumber;

		this.loadBillings();

		this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
			this.LOADING_MESSAGE = value.LOADING_MESSAGE;
		});

		this.translate.get(['CONNECTION_ERROR']).subscribe((value) => {
			this.CONNECTION_ERROR = value.CONNECTION_ERROR;
		});
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
		let seq
		if(this.ContentDisabled){
			seq = this.transaction.ContractDocumentPremiumList();
		}else{
			seq = this.transaction.ContractDocumentList();
		}
		
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
 				
 				if(this.ContentDisabled){
 					if(this.currentItems){ 
 						if(this.currentItems.length > 0)
 						{
 							let sumcontract = 0
 							for(let i = 0; i <= this.currentItems.length - 1; i ++)
 							{
 								sumcontract = sumcontract + Number(res[i].TotalWithTax)
 							}	
 							this.lblcontract = sumcontract;
 						}
 					} 					
 					this.loadingControl('dismiss', loading);
 				}else{
					let seqCommitmentDetails = this.transaction.CommitmentDetails(this.transaction._charsourceid, this.transaction._transactionnumber, this.transaction._dbname);

					seqCommitmentDetails.subscribe((res: any) => {
						this.loadingControl('dismiss', loading);
						this.lblcontract = Number(res[1][0].OrderTotal) + Number(res[1][0].CanadianTaxes)
					}), (err) => {
						this.doToast(this.CONNECTION_ERROR);
						this.loadingControl('dismiss', loading);
					};
				}

			}), (err) => {
				this.loadingControl('dismiss', loading);
				this.doToast(this.CONNECTION_ERROR);
			};
		})
	}

	openView(item: Item) {	 
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

		 	if(!this.ContentDisabled)
		 	{
				let filePath: string = 'contentviewlnk=../workorders/buyout_/views/ViewStdCommitment.asp&client=' + this.transaction._dbname + '&woid=' + this.project._projectnumber + '&mod=' + this.project._projectscope +
				'&wosta=&buyoutID=' + item.BuyoutID + '&ponum=' + this.transaction._transactionnumber + '&type=' + item.BOTypePreFix + '&tomod=' + item.TO_Mod + '&WorkorderID=' + this.project._projectnumber + '&emailview=true&tpview=true'

				let base64Str: string = window.btoa(filePath);  
				window.open(encodeURI(this.constant.urlEnviroment + '/rts/app/asp/tpl.projectconsole.asp?p=' + base64Str +'&ContactID=' + item.UserID), "_system","location=yes");	     		  	
			}else 
			{  
				window.open(this.constant.urlTPUploads + 
				this.user._usercompanyid + '/'+ 
				this.customer._customerid + '/' +
				this.project._projectnumber + '/commitment/' + item.Attachment, "_system","location=yes");
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

	doRefresh(refresher: Refresher) {
 
		let seq
		if(this.ContentDisabled){
			seq = this.transaction.ContractDocumentPremiumList();
		}else{
			seq = this.transaction.ContractDocumentList();
		}

		seq.subscribe((res: any) => {
			this.currentItems = res;
 
 			let seqCommitmentDetails = this.transaction.CommitmentDetails(this.transaction._charsourceid, this.transaction._transactionnumber, this.transaction._dbname);

				seqCommitmentDetails.subscribe((res: any) => { 
					this.lblcontract = Number(res[1][0].OrderTotal) + Number(res[1][0].CanadianTaxes)
				}), (err) => {
					this.doToast(this.CONNECTION_ERROR);
				};

			setTimeout(() => {
				refresher.complete();
				this.translate.get(['CONTRACT_DOCUMENTS_LIST_UPDATED']).subscribe((value) => {
					const toast = this.toastCtrl.create({
						message: value.CONTRACT_DOCUMENTS_LIST_UPDATED,
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
				if (item.Description.toLowerCase().indexOf(queryWord) > -1 || 
					String(item.OrderTotal).indexOf(queryWord) > -1) {
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
		 
	}
  

}
