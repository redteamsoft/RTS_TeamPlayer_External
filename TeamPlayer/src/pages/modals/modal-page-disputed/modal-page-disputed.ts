import { Component, ElementRef } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction } from '../../../providers';

/**
 * Generated class for the ModalPageDisputedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-page-disputed',
  templateUrl: 'modal-page-disputed.html',
})
export class ModalPageDisputed {

  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;
  type: any;
  Line = 0;
  Description: any;
  AmountDisputed: number;
  Author: any;
  AuthorPosition: any;
  DateDisputed: any;
  Comment: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    private view: ViewController,
    public transaction: Transaction,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public element: ElementRef) {
  }

  ionViewDidLoad() {

  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    const line = this.navParams.get('line');
    const type = this.navParams.get('type');
    this.Line = line;
    this.type = type;

    this.translate.get(['LOADING_MESSAGE']).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
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
    let seq = this.transaction.DisputedBill(data.DisputedId);

    seq.subscribe((res: any) => {

      this.Description = data.Description;
      this.AmountDisputed = this.transaction.getNumber(data.AmountDisputed);
      this.Author = res[0].rtAuthor_tp;
      this.AuthorPosition = res[0].rtPosition_tp;
      this.DateDisputed = res[0].rtCommentDate_tp;
      this.Comment = res[0].rtComment_tp;
      this.loadingControl('dismiss', loading);
      this.adjust();

    }), (err) => {
      this.loadingControl('dismiss', loading);
      this.doToast(this.CONNECTION_ERROR);
    }

  }

  loadingControl(band = '', loading) {
    if (band === 'start') {
      loading.present();
    } else {
      loading.dismiss();
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

  cancelModal() {
    this.view.dismiss();
  }

  adjust() {
    const ta = this.element.nativeElement.querySelector('#txtdescription');
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 'px';
  }

}
