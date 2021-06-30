import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, Refresher, LoadingController, ToastController, AlertController, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Project, Transaction, Constant, User, Customer } from '../../providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
	selector: 'page-credentials',
	templateUrl: 'list-credentials.html'
})
export class ListCredentialsPage {
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

		this.loadCredentials();

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

	loadCredentials() {
		
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

			let seq = this.transaction.CredentialList();

			seq.subscribe((res: any) => {
				//console.log(res.Credentials)
				//console.log(res.Credentials[0].credDisplay)
				if (res.Credentials.length != 0) {
					this.currentItems = res.Credentials;
				}				
				this.loadingControl('dismiss', loading);
			}), (err) => {
				this.doToast(this.CONNECTION_ERROR);
				this.loadingControl('dismiss', loading);
			}				
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
		let seq = this.transaction.CredentialList();

		seq.subscribe((res: any) => {
			//console.log(res.Credentials)
			//console.log(res.Credentials[0].credDisplay)
			if (res.Credentials.length != 0) {
				this.currentItems = res.Credentials;
			}	
			refresher.complete();		
			
		}), (err) => {
			this.doToast(this.CONNECTION_ERROR);
			refresher.complete();			
		}
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
