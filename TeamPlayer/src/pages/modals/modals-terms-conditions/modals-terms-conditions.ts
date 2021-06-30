import { Component, ElementRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController,
  ViewController,
} from "ionic-angular";

/**
 * Generated class for the ModalsTermsConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-modals-terms-conditions",
  templateUrl: "modals-terms-conditions.html",
})
export class ModalsTermsConditionsPage {
  Comment: any;
  LOADING_MESSAGE: any;
  CONNECTION_ERROR: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    public element: ElementRef,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService
  ) {}

  ionViewDidLoad() {
    //console.log("ionViewDidLoad ModalsTermsConditionsPage");
  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');

    this.translate.get(["LOADING_MESSAGE"]).subscribe((value) => {
      this.LOADING_MESSAGE = value.LOADING_MESSAGE;
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

    this.Comment =  data.VendorCertification;

    this.loadingControl('dismiss', loading);
    //this.adjust();
  }

  ionViewDidEnter(){
    //this.adjust();
  }

  cancelModal() {
    this.view.dismiss();
  }

  adjust() {
    const ta = this.element.nativeElement.querySelector("#txtdescription");
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }

  loadingControl(band = "", loading) {
    if (band === "start") {
      loading.present();
    } else {
      loading.dismiss();
    }
  }

  doToast(str) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
      position: "top",
    });
    toast.present();
  }
}
