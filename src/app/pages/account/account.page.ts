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
  matcher = new MyErrorStateMatcher();
  fenabled = false;
  lenabled = false;
  stenabled = false;
  isEditable = false;
  editClose = "Edit"
  defaultPic = "../../../assets/profile.png"

  
  constructor(public popoverController: PopoverController,
     private dbs: DatabaseService, private acs: AccountService) { }

  ngOnInit() {
    this.signupForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      studentNumber:  ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9), Validators.pattern("^[0-9]{9}$")]],
    
    })

    this.signupForm.controls["firstname"].setValue(this.acs.user.firstname)
    this.signupForm.controls["lastname"].setValue(this.acs.user.lastname)
    this.signupForm.controls["studentNumber"].setValue((<Student>this.acs.user).studentNumber)
  }

  get firstname() { return this.signupForm.get('firstname')}

  get lastname() { return this.signupForm.get('lastname')}

  get studentNumber() { return this.signupForm.get('studentNumber')}


  navigate(){
    // this.router.navigateByUrl("menu/signin")
  }

  signup(){
    // this.auth.signup(this.signupForm.value["firstname"], this.signupForm.value["lastname"],
    // this.signupForm.value["phone"], this.signupForm.value["email"], this.signupForm.value["password"])
  }

  fnameEnable(){
    this.fenabled = true;
  }

  lnameEnable(){
    this.lenabled = true;
  }

  phoneEnable(){
    this.stenabled = true;
    
  }

  async edit(event){
    const popover = await this.popoverController.create({
      component: EditpicPage,
      cssClass: 'my-custom-class',
      translucent: true,
      event: event
    });
    await popover.present();

  }

  editInfor(){
    this.isEditable = !this.isEditable;


    this.editClose = this.isEditable ? "Cancel" : "Edit"

    this.signupForm.controls["firstname"].setValue(this.acs.user.firstname)
    this.signupForm.controls["lastname"].setValue(this.acs.user.lastname)
    this.signupForm.controls["studentNumber"].setValue((<Student>this.acs.user).studentNumber)
    
  }

  update(){
    this.editClose = "Edit";
    console.log(this.signupForm)
    this.dbs.updateInfor(this.signupForm.value["firstname"],
    this.signupForm.value["lastname"], this.signupForm.value["studentNumber"]);

  }



}
