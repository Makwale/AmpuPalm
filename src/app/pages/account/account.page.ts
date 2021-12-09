import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  isAddressEdit = false;
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
      email: [''],
    });

    this.nxtKinForm = new FormBuilder().group({
      firstname: [''],
      lastname: [''],
      email: [''],
    });

    this.addNxtKinForm = new FormBuilder().group({
      email: [''],
    });

    this.physAddressForm = new FormBuilder().group({
      houseNo: ['', [Validators.required]],
      streetName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      town: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      postalCode: ['', [Validators.required]],
    });

    console.log(this.acs.user);

    this.accountForm.controls.firstname.setValue(this.acs.user.firstname);
    this.accountForm.controls.lastname.setValue(this.acs.user.lastname);
    this.accountForm.controls.email.setValue(this.acs.user.email);
    this.physAddressForm.controls.houseNo.setValue(this.acs.user.address.houseNo);
    this.physAddressForm.controls.streetName.setValue(this.acs.user.address.streetName);
    this.physAddressForm.controls.town.setValue(this.acs.user.address.town);
    this.physAddressForm.controls.postalCode.setValue(this.acs.user.address.postalCode);
    if (this.acs.user.nextOfKin) {
      this.nxtKinForm.controls.firstname.setValue(this.acs.user.nextOfKin.firstname);
      this.nxtKinForm.controls.lastname.setValue(this.acs.user.nextOfKin.lastname);
      this.nxtKinForm.controls.email.setValue(this.acs.user.nextOfKin.email);
    }
  }

  get firstname() { return this.accountForm.get('firstname'); }

  get lastname() { return this.accountForm.get('lastname'); }

  get houseNo() { return this.physAddressForm.get('houseNo'); }

  get streetName() { return this.physAddressForm.get('streetName'); }

  get town() { return this.physAddressForm.get('town'); }

  get postalCode() { return this.physAddressForm.get('postalCode'); }

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
        this.isAddressEdit = !this.isAddressEdit;
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
          this.isAddressEdit = !this.isAddressEdit;
        });
        break;
    }

  }

  isAddNextOfKin(main: any) {
    this.addNextOfKin = !this.addNextOfKin;
    main.scrollToBottom();
    this.dbs.getNextOfKins().subscribe(data => {
      this.nextOfKings = data.map(res => {
        const tempObj: User = res.payload.doc.data();
        tempObj.id = res.payload.doc.id;
        return tempObj;
      });
      console.log(this.nextOfKings);
    });
  }

  searchNextOfKin(main: any) {
    this.foundNxtOfKin = this.nextOfKings.find(
      user => user.email === String(this.addNxtKinForm.controls.email.value).trim());
    if (this.foundNxtOfKin) {
      main.scrollToBottom();
    }
  }

  select() {
    this.dbs.addNextOfKin(this.foundNxtOfKin).then(_ => {
      this.acs.user.nextOfKin = this.foundNxtOfKin;
      this.foundNxtOfKin = undefined;
      this.addNextOfKin = false;
      this.addNxtKinForm?.setValue({
        email: ''
      });
      alert('Next of kin added');
    });
  }

  cancel(section: string) {
    switch (section) {
      case 'pers_info':
        this.isPerInfoEdit = !this.isPerInfoEdit;
        break;
      case 'address':
        this.isAddressEdit = !this.isAddressEdit;
        break;
    }
  }

  async deleteNxtKin() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.dbs.deleteNxtKin().then(_ => {
              this.acs.user.nextOfKin = undefined;
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillLeave() {
    // this.accountForm = undefined;
    // this.physAddressForm = undefined;
    // this.nxtKinForm = undefined;
    // this.addNxtKinForm = undefined;
    console.log('will leave');
  }


}
