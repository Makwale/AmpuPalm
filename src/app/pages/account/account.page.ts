import { Component, DoCheck, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EditpicPage } from '../editpic/editpic.page';
import { PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/modells/user.model';
import { AlertController } from '@ionic/angular';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
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
export class AccountPage implements OnInit, DoCheck {

  @ViewChild('main') ionContent: ElementRef;
  accountForm: FormGroup;
  physAddressForm: FormGroup;
  nxtKinForm: FormGroup;
  addNxtKinForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  fenabled = false;
  lenabled = false;
  stenabled = false;
  isPerInfoEdit = false;
  editClose = 'Edit';
  defaultPic = '../../../assets/profile.png';
  addNextOfKin = false;
  nextOfKings: User[];
  foundNxtOfKin: User;
  constructor(public popoverController: PopoverController,
    private dbs: DatabaseService,
    private acs: AccountService,
    private auth: AuthService,
    public alertController: AlertController,
    private router: Router) { }

  ngOnInit() {
    this.accountForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      phone: [''],
      email: ['']
    });
  }

  ngDoCheck() {
    this.accountForm.controls.firstname.setValue(this.acs.user.firstname);
    this.accountForm.controls.lastname.setValue(this.acs.user.lastname);
    this.accountForm.controls.phone.setValue(this.acs.user.phone);
    this.accountForm.controls.email.setValue(this.acs.user.email);
  }

  get firstname() { return this.accountForm.get('firstname'); }

  get lastname() { return this.accountForm.get('lastname'); }

  get phone() { return this.accountForm.get('phone'); }

  get email() { return this.accountForm.get('email'); }

  navigate() {
    // this.router.navigateByUrl("menu/signin")
  }
  signup() {
    // this.auth.signup(this.accountForm.value["firstname"], this.accountForm.value["lastname"],
    // this.accountForm.value["phone"], this.accountForm.value["email"], this.accountForm.value["password"])
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
    this.isPerInfoEdit = !this.isPerInfoEdit;
    this.editClose = this.isPerInfoEdit ? 'Cancel' : 'Edit';
    this.accountForm.controls.firstname.setValue('Comming soon');
    this.accountForm.controls.lastname.setValue('Comming soon');

  }

  update() {
    this.editClose = 'Edit';
    console.log(this.accountForm);
    // this.dbs.updateInfor(this.accountForm.value.firstname,
    //   this.accountForm.value.lastname);

  }

  enableEdit(section: string) {
    switch (section) {
      case 'pers_info':
        this.isPerInfoEdit = !this.isPerInfoEdit;
        break;
      case 'address':
        // this.isAddressEdit = !this.isAddressEdit;
        break;
    }
  }

  save(section: string) {
    switch (section) {
      case 'pers_info':
        this.dbs.updatePersInfo(this.accountForm).then(_ => {
          this.isPerInfoEdit = !this.isPerInfoEdit;
          alert('Personal info updated');
        });
        break;
      case 'address':
        this.dbs.updateAddress(this.physAddressForm).then(_ => {
          alert('Physical address updated');
          // this.isAddressEdit = !this.isAddressEdit;
        });
        break;
    }

  }

  cancel(section: string) {
    this.isPerInfoEdit = !this.isPerInfoEdit;
  }

  ionViewWillLeave() {
    // this.accountForm = undefined;
    // this.physAddressForm = undefined;
    // this.nxtKinForm = undefined;
    // this.addNxtKinForm = undefined;
    console.log('will leave');
  }

  changeStatus(event: MatButtonToggleChange) {
    this.dbs.changeStatus(event.value);
  }

}
