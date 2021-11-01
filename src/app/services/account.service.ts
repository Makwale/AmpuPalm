import { Injectable } from '@angular/core';
import { Student } from '../modells/student.model';
import { User } from '../modells/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  user: User;
  loginStatus = false;

  constructor() { }
}
