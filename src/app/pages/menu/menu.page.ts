import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { DatabaseService } from 'src/app/services/database.service';
import { PopoverController } from '@ionic/angular';
import { EditpicPage } from '../editpic/editpic.page';
import { SearchbusPage } from '../searchbus/searchbus.page';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { ProfilePage } from '../profile/profile.page';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  defaultPic = '../../../assets/profile.png';

  constructor(public modalController: ModalController,
    private menu: MenuController, private router: Router,
    private dbs: DatabaseService, private acs: AccountService,
    private afa: AngularFireAuth, public popoverController: PopoverController,
    private oneSignal: OneSignal, private auth: AuthService) { }

  ngOnInit() {
  }

  toggle() {
    this.menu.toggle();
  }

  navigate(route) {
    this.menu.toggle();
    if (route === '') { this.router.navigateByUrl(''); }
    else { this.router.navigateByUrl(route); };
  }

  navigatef(route) {

    if (route === '') { this.router.navigateByUrl(''); }
    else { this.router.navigateByUrl(route); };
  }

  navigateToMap() {
    this.router.navigateByUrl('map');
  }

  signout() {
    this.afa.signOut().then(res => {
      this.acs.loginStatus = false;
      this.router.navigateByUrl('menu');
      this.dbs.bookings = [];
      this.menu.toggle();
    });
  }

  signoutf() {
    this.afa.signOut().then(res => {
      this.acs.loginStatus = false;
      this.router.navigateByUrl('menu');
      this.dbs.bookings = [];
    });
  }

  async edit(event) {
    const popover = await this.popoverController.create({
      component: EditpicPage,
      cssClass: 'my-custom-class',
      translucent: true,
      event
    });
    await popover.present();

  }

  async profile(event) {
    const popover = await this.popoverController.create({
      component: ProfilePage,
      cssClass: 'my-custom-class',
      translucent: true,
      event
    });
    await popover.present();

  }

  async searchbus() {

    const modal = await this.modalController.create({
      component: SearchbusPage,

    });
    return await modal.present();
  }


  //-25.731898523213264, 28.162400726583623

}
