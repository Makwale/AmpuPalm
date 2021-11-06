import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EditpicPage } from '../editpic/editpic.page';
import { PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { AccountService } from 'src/app/services/account.service';
import { Student } from 'src/app/modells/student.model';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  signupForm: FormGroup;
  physAddressForm: FormGroup;
  nxtKinForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  fenabled = false;
  lenabled = false;
  stenabled = false;
  isEditable = false;
  editClose = 'Edit';
  defaultPic = '../../../assets/profile.png';


  constructor(public popoverController: PopoverController,
    private dbs: DatabaseService,
    private acs: AccountService,
    private auth: AuthService) { }

  ngOnInit() {
    this.signupForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
    });

    this.nxtKinForm = new FormBuilder().group({
      firstname: [''],
      lastname: [''],
      email: [''],
    });

    this.physAddressForm = new FormBuilder().group({
      houseNo: ['', [Validators.required]],
      streetName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      town: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      postalCode: ['', [Validators.required]],
    });


    this.signupForm.controls.firstname.setValue('Comming soon');
    this.signupForm.controls.lastname.setValue('Comming soon');
  }

  get firstname() { return this.signupForm.get('firstname'); }

  get lastname() { return this.signupForm.get('lastname'); }

  get houseNo() { return this.physAddressForm.get('houseNo'); }

  get streetName() { return this.physAddressForm.get('streetName'); }

  get town() { return this.physAddressForm.get('town'); }

  get postalCode() { return this.physAddressForm.get('postalCode'); }

  navigate() {
    // this.router.navigateByUrl("menu/signin")
  }

  signup() {
    // this.auth.signup(this.signupForm.value["firstname"], this.signupForm.value["lastname"],
    // this.signupForm.value["phone"], this.signupForm.value["email"], this.signupForm.value["password"])
  }

  fnameEnable() {
    this.fenabled = true;
  }

  lnameEnable() {
    this.lenabled = true;
  }

  phoneEnable() {
    this.stenabled = true;

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

  editInfor() {
    this.isEditable = !this.isEditable;


    this.editClose = this.isEditable ? 'Cancel' : 'Edit';

    this.signupForm.controls.firstname.setValue('Comming soon');
    this.signupForm.controls.lastname.setValue('Comming soon');

  }

  update() {
    this.editClose = 'Edit';
    console.log(this.signupForm);
    // this.dbs.updateInfor(this.signupForm.value.firstname,
    //   this.signupForm.value.lastname);

  }



}
