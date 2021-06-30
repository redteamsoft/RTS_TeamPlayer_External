import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, Project, Constant, User } from '../../../providers';
import { EmailComposer } from '@ionic-native/email-composer'; 
import { CallNumber } from '@ionic-native/call-number';
import { Intercom } from '@ionic-native/intercom';

@IonicPage()
@Component({
  selector: 'page-modal-page-helpcenter',
  templateUrl: 'modal-page-helpcenter.html',
})
export class ModalPageHelpCenter {
  IsPlatformWeb: boolean;

  constructor(
    private view: ViewController,
    public emailComposer: EmailComposer, 
    public translate: TranslateService,
    public transaction: Transaction,
    public project: Project,
    public constant: Constant,
    private callNumber: CallNumber,
    public plt: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public user: User,
    private intercom: Intercom) {  
  }

  ionViewWillLoad() {
    this.IsPlatformWeb = this.plt.is('core');
    
    this.intercom.registerIdentifiedUser({email: this.user._useremail});
    this.intercom.updateUser({
      // Pre-defined user attributes
      user_id: this.user._userid,
      name: this.user._userfirstname +' '+ this.user._userlastname ,
      companies: [{
          company_id: this.user._usercompanyid,
          name: this.user._companyname
      }]
    });
  }

  intercomFnc(){
    this.intercom.displayMessenger();
  }

  chat(){    
    let webChat = this.constant.urlChat 
    window.open(encodeURI(webChat), "_system","location=yes");
  }

  sendEmail(){
      let email = {
      to: 'service+teamplayer@redteam.com',  
      subject: '',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  call(){
    if (this.plt.is('core')) {
      document.location.href = "tel:8664322021";
    }else{
      this.callNumber.callNumber("8664322021", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err)); 
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

  ToolTip(message: string) {

    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }


}
