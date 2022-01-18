import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private router: Router, private afa: AngularFireAuth,
    private acs: AccountService, public popoverController: PopoverController,
    private dbs: DatabaseService) { }

  ngOnInit() {
  }

  navigate() {
    this.router.navigateByUrl('account');

    this.popoverController.dismiss();
  }

  async signout() {
    await this.afa.signOut().then(async res => {
      this.acs.loginStatus = false;
      console.log(this.acs.user);
      this.acs.user = undefined;
      console.log(this.acs.user);
      await this.popoverController.dismiss();
      this.router.navigateByUrl('menu/signin');

    });

  }



}
