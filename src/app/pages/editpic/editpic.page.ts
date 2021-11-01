import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-editpic',
  templateUrl: './editpic.page.html',
  styleUrls: ['./editpic.page.scss'],
})
export class EditpicPage implements OnInit {

  constructor(private dbs: DatabaseService, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  updatePic(event){
    this.dbs.updatePic(event.target.files[0]);
    this.popoverController.dismiss()
  }

}
