import { Component } from "@angular/core";
import { ViewController, NavParams, NavController } from "ionic-angular";

@Component({
  selector: "popover-contract",
  templateUrl: "popover-contract.html",
})
export class PopoverContractComponent {
  item: any;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public navCtrl: NavController
  ) {
    //console.log("PopoverContractComponent");    
  }

  goProjects() {
    this.item = {
      event: "Projects",
    };
    this.viewCtrl.dismiss(this.item);
  }

  goTransactions() {
    this.item = {
      event: "Transactions",
    };
    this.viewCtrl.dismiss(this.item);
  }
}
