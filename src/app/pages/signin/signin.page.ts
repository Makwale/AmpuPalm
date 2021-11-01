import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  email;
  password;
  clicked = false;
  isReset = false;
  constructor(private router: Router, private auth: AuthService, private afa: AngularFireAuth,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  navigate() {
    this.router.navigateByUrl('signup');
  }

  signin() {

    this.auth.signIn(this.email, this.password);
    this.email = '';
    this.password = '';
  }

  reset() {
    this.isReset = true;
  }

  cancel() {
    this.email = '';
    this.password = '';
    this.isReset = false;
  }

  resetPassword() {
    this.afa.sendPasswordResetEmail(this.email).then(async () => {
      this.isReset = false;
      const toast = await this.toastController.create({
        message: 'Link to reset password has been sent to your email',
        duration: 4000,
        color: 'success'
      });
      toast.present();
    }).catch(async error => {
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    });

  }


}
