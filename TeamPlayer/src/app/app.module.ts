import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core'; 
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'; 
import { Keyboard } from '@ionic-native/keyboard';
import { Items } from '../mocks/providers/items';
import { Settings, User, Api, Customer, Project, Transaction, Constant, ProjectTeam, Metadata } from '../providers';
import { MyApp } from './app.component';
import { FileChooser } from '@ionic-native/file-chooser';
//import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Deeplinks } from '@ionic-native/deeplinks';
import { File as IonicFile } from '@ionic-native/file/ngx';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';
import { Market } from '@ionic-native/market/ngx';
import { FilePath } from '@ionic-native/file-path';
import { PopoverComponent } from '../components/popover/popover';
import { ProjectMenuComponent } from '../components/project-menu/project-menu';
import { Intercom } from '@ionic-native/intercom';
import { PopoverContractComponent } from '../components/popover-contract/popover-contract';
//, FileUploadOptions, FileTransferObject
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    language: '1'
  });
}

@NgModule({
  declarations: [
    MyApp, 
    PopoverComponent,
    PopoverContractComponent,
    ProjectMenuComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    PopoverComponent,
    PopoverContractComponent,
    ProjectMenuComponent,
  ],
  providers: [
    Api,
    Items,
    User,
    Customer,
    Project,
    Transaction,
    Constant,
    ProjectTeam,
    Metadata,
    Camera,
    SplashScreen,
    StatusBar,
    FileChooser,
    IonicFile,
    Market,
    //IOSFilePicker,
    EmailComposer,
    CallNumber,
    FilePath,
    FileTransfer,
    Keyboard,
    Deeplinks,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }, 
    DecimalPipe,
    PercentPipe,
    Intercom,
  ]
})
export class AppModule { }
