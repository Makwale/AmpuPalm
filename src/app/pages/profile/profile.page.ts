import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private router: Router, private afa: AngularFireAuth,
     private acs: AccountService, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  navigate(){
    this.router.navigateByUrl("account")

    this.popoverController.dismiss()
  }

  signout(){
    this.router.navigateByUrl("")
    this.afa.signOut().then(res => {
      this.acs.loginStatus = false;
      this.acs.user = null;
      
    })

    this.popoverController.dismiss()
  }



}
