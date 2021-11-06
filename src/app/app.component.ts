import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AccountService } from './services/account.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [StatusBar]
})
export class AppComponent implements OnInit {
  constructor(
    private statusBar: StatusBar,
    private auth: AngularFireAuth,
    private router: Router,
    private acs: AccountService) { }
  ngOnInit() {
    // this.statusBar.overlaysWebView(false);
    // this.statusBar.backgroundColorByHexString('#031b36');
    this.auth.user.subscribe(user => {
      if (user) {
        this.router.navigateByUrl('menu/home');
        this.acs.loginStatus = true;
      } else {
        this.router.navigateByUrl('menu/signup');
      }
    });
  }
}
