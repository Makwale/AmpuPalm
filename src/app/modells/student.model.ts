import { User } from "./user.model";

export class Student extends User{
    studentNumber;

    constructor(id, firstname, lastname, studentNumber , email, imgURL?, playerid?){
        
        super(id, firstname, lastname, email, imgURL, playerid)

        this.studentNumber = studentNumber;
       
    }
}