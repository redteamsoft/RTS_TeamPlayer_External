import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';

import { Settings } from '../../providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS';
  pageTitle: string;
  lblopt1: boolean;
  lblopt2: boolean;
  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    private modal: ModalController,
    public navParams: NavParams,
    public translate: TranslateService) {

    translate.setDefaultLang('en');

  }

  _buildForm() {
    let group: any = {
      language: [this.options.language]
    };

    if(this.options.language == 1)
    {
      this.lblopt1 = true;
      this.lblopt2 = false;
    }else{
      this.lblopt2 = true;
      this.lblopt1 = false;
    }

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          //option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {

         this.lblopt1 = false;
        this.lblopt2 = false;

        this.settings.merge(this.form.value);
 
        if(this.form.value.language == 1)
        { 
           this.translate.use('en');
           //this.translate.setDefaultLang('en'); 
        }else if(this.form.value.language == 2){
            this.translate.use('es');
        }else{         
          //this.translate.setDefaultLang('es'); 
           this.translate.use('en');
        }

        this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
        this.translate.get(this.pageTitleKey).subscribe((res) => {
            this.pageTitle = res;
        })

    });



  }

  openModalHelp(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = '';
    let i = 0;
    const myModal: Modal = this.modal.create('ModalPageHelpCenter', { data: myModalData, line: i }, myModalOptions);
    myModal.present();
  }
  
  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
 
    console.log('Ng All Changes');
  }
}
