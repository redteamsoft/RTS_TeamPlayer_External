import { Injectable } from '@angular/core';

@Injectable()
export class Constant {

  versionCodeAndroid: string = '1.0.27'
  versionCodeiOS: string = '1.0.27'
  versionCodeBrowser: string = '1.0.27'
  
  //METIS

  dev: string = 'asiccha'
  urlEnviroment: string = 'https://'+this.dev+'.redteamsoftware.net';
  url: string = 'https://6hrvcrawbi.execute-api.us-east-1.amazonaws.com/METIS';
  urlCommitment: string = this.urlEnviroment + '/rts/app/workorders/buyout_/views/GenerateUrl.asp';
  urlCredentials: string = this.urlEnviroment + '/rts/app/workorders/buyout_/TP_BuyoutCredentials.asp';
  urlWaivers: string = this.urlEnviroment + '/rts/app/workorders/lienlaw_/TP_LienWaivers.asp';
  urlRoute: string = this.urlEnviroment + '/rts/app/vendors/payables_/vendorinvoice_tp.asp';
  urleapps: string = 'https://teamplayer'+this.dev+'be.redteamsoftware.net';  
  urlLink: string = 'http://dev.redteam.link/';
  urlUploadRT: string = this.urlEnviroment + '/TeamMobile/rts_ws/fileupload.php';
  urlRTUploaded: string = '.redteamsoftware.net/Uploads';
  urlTPWeb: string = 'https://teamplayer'+this.dev+'.redteamsoftware.net/site';
  urlTPUploads: string = 'https://teamplayer'+this.dev+'.redteamsoftware.net/Uploads/';
  urlChat: string = 'https://lc.chat/now/7134341/';
  urlVersionValidate: string = 'https://teamplayer'+this.dev+'.redteamsoftware.net/version_validate.json';
  localMode: boolean = true; //true: MODE MOBILE

  constructor() {
    window.localStorage.setItem('urlEnviroment', this.urlEnviroment);
    window.localStorage.setItem('urlLink', this.urlLink);
    window.localStorage.setItem('versionCodeBrowser', this.versionCodeBrowser);
    window.localStorage.setItem('versionCodeAndroid', this.versionCodeAndroid);
    window.localStorage.setItem('versionCodeiOS', this.versionCodeiOS);
    window.localStorage.setItem('urlUploadRT', this.urlUploadRT);
  }
}
