import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, Project, Constant } from '../../../providers';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-modal-page-addfiles',
  templateUrl: 'modal-page-addfiles.html',
})

export class ModalPageAddFiles {
  public IsBrowser: boolean = false;
  public attachItems = [];
  constructor(
    public http: HttpClient,
    private fileChooser: FileChooser,
    public platform: Platform,
    private filePath: FilePath,
    private view: ViewController,
    public translate: TranslateService,
    public transaction: Transaction,
    public project: Project,
    public constant: Constant,
    public camera: Camera,
    public plt: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.IsBrowser = true;
    }
  }

  ionViewWillLoad() {
  }

  addfiles(band) {

    if (band == "camera") {
      let sourceType
      //if(band == "gallery"){
      //  sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
      //}else if(band == "camera"){
      sourceType = this.camera.PictureSourceType.CAMERA
      //}

      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
        let base64Image = imageData;
        this.confirmModal(base64Image, 'jpg', '');
      }, (err) => {
      });
    } else {

      this.fileChooser.open()
        .then(uri => {
          this.filePath.resolveNativePath(uri)
            .then(filePath => {
              let indextype
              let index = filePath.indexOf(".pdf");
              indextype = index > 0 ? "pdf" : "jpeg"

              this.confirmModal(uri, indextype, '');

            })
            .catch(err => console.log(err));
        })
        .catch(e => console.log(e));
    }
  }


  confirmModal(file, type, filename) {
    let typeimage = (type == 'jpeg' || type == 'jpg') ? 'imageattach.svg' : 'pdfattach.svg'

    switch (type) {
      case ("jpeg"):
      case ("jpg"):
      case ("png"):
      case ("gif"):
      case ("tif"):
      case ("tiff"):
        typeimage = 'imageattach.svg';
        break;
      case ("pdf"):
        typeimage = 'pdfattach.svg';
        break;
      case ("docx"):
      case ("doc"):
        typeimage = 'docxattach.svg';
        break;
      case ("dwf"):
        typeimage = 'dwfattach.svg';
        break;
      case ("dwg"):
        typeimage = 'dwgattach.svg';
        break;
      case ("mpp"):
        typeimage = 'mppattach.svg';
        break;
      case ("txt"):
        typeimage = 'txtattach.svg';
        break;
      case ("mp4"):
      case ("wmv"):
        typeimage = 'videoattach.svg';
        break;
      case ("xlsx"):
      case ("xls"):
        typeimage = 'xlsxattach.svg';
        break;
      case ("xps"):
        typeimage = 'xpsattach.svg';
        break;
      case ("mp3"):
        typeimage = 'mp3attach.svg';
        break;
    }

    const data = {
      type: type,
      typeimage: typeimage,
      file: file,
      description: ""
    };

    if (this.IsBrowser) {
      data.description = filename;
      this.attachItems.push(data);
    } else {
      this.view.dismiss(data);
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
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }

  fileChanged(event) {

    var files = event.target.files;
    let iterations = files.length;

    for (let file of files) {
      var size = file.size;

      //console.log(files);
      var regex = new RegExp("(.*?)\.(docx|dwf|dwg|gif|jpeg|jpg|mp3|mp4|mpp|pdf|png|tif|tiff|txt|wmv|xlsx|xps|doc|xls)$");

      if (regex.test(file.name) && ((size / 1024) / 1024) <= 25) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = (result: any) => {
          //console.log('File Reader Result: ' + JSON.stringify(result));

          let arrayBuffer = result.target.result;
          let blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });

          //let indextype
          let indextype = file.name.split('.').pop();
          //indextype = index > 0 ? "pdf" : "jpeg"

          this.confirmModal(blob, indextype, file.name)

          if (!--iterations) {
            this.view.dismiss(this.attachItems);
          }
        }

      } else {
        this.ToolTip("Please select correct file format or the file you are trying to send exceeds the 25MB attachment limit.");
      }
    }
  }


}
