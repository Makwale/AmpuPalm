import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {

  signupForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  fenabled = false;
  lenabled = false;
  stenabled = false;
  emenabled = false;
  passenabled = false;
  hasCode = false;

  constructor(private router: Router, private auth: AuthService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.auth.getSignedUpStudents()
    this.signupForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      studentNumber:  ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9), Validators.pattern("^[0-9]{9}$")]],
      password: ['', [Validators.minLength(8),Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{7,}')]],
      cpassword: [''],
    })

    this.signupForm.controls["firstname"].setValue("")
    this.signupForm.controls["lastname"].setValue("")
    this.signupForm.controls["email"].setValue("")
    this.signupForm.controls["studentNumber"].setValue("")
    this.signupForm.controls["password"].setValue("")
    this.signupForm.controls["cpassword"].setValue("")
  }

  ngOnDestroy(){
  
    this.signupForm = null
  }

  get firstname() { return this.signupForm.get('firstname')}

  get lastname() { return this.signupForm.get('lastname')}

  get email() { return this.signupForm.get('email')}

  get studentNumber() { return this.signupForm.get('studentNumber')}

  get password() { return this.signupForm.get('password')}

  get cpassword() { return this.signupForm.get('cpassword')}


  navigate(){
    this.router.navigateByUrl("signin")
  }

  async signup(){

    if(this.auth.studentNumbers.indexOf(this.signupForm.value["studentNumber"]) == -1){

      if(this.signupForm.value["password"] == this.signupForm.value["cpassword"]){
        this.auth.signup(this.signupForm.value["firstname"], this.signupForm.value["lastname"],
        this.signupForm.value["studentNumber"], this.signupForm.value["email"], this.signupForm.value["password"])
       
        
      }else{
        const toast = await this.toastController.create({
          message: "Passwords do not match",
          duration: 4000,
          color: "danger"
        });
        toast.present();
      }
    }else{
      
      const toast = await this.toastController.create({
        message: "Student number is already used by another account",
        duration: 4000,
        color: "danger"
      });
      toast.present();
  
    }
    
    
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

  emailEnable(){
    this.emenabled = true;
  }

  passEnable(){
    this.passenabled = true;
  }

  keydown(){
    console.log(String(this.signupForm.value["phone"]).length)
    if(String(this.signupForm.value["phone"]).length == 3)
    
      this.hasCode = String(this.signupForm.value["phone"]).substring(0,3) == "+27" ? true : false 

  }

}
