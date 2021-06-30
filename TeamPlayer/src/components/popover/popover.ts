import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { User } from '../../providers';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  text: string;
  item: any;
  data: any;
  btnAccessBilling: any;

  constructor(public viewCtrl: ViewController, public navParams:NavParams, public user: User) {
    //console.log('Hello PopoverComponent Component');
    //this.text = 'Hello World';

    //console.log(this.navParams.data);
    this.btnAccessBilling = this.user.validateUserPermissions("Billing");
    this.data = this.navParams.data;
  }

  View() {
    this.item = {
      id: this.navParams.data.TransactionDetailId,
      attach: this.navParams.data.AttachName,
      status: this.navParams.data.Status,
      event: "View"
    }
    this.viewCtrl.dismiss(this.item);
  }

  Email() {
    this.item = {
      id: this.navParams.data.TransactionDetailId,
      attach: this.navParams.data.AttachName,
      status: this.navParams.data.Status,
      event: "Email"
    }
    this.viewCtrl.dismiss(this.item);
  }

  Recreate() {
    this.item = {
      id: this.navParams.data.TransactionDetailId,
      attach: this.navParams.data.AttachName,
      status: this.navParams.data.Status,
      event: "Recreate"
    }
    this.viewCtrl.dismiss(this.item);
  }

}
