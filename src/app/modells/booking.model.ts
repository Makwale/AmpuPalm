import { Slot } from "./slot.model";

export class Booking{
    id;

    slot;

    studentId;
    
    studentNumber;

    playerid;

    cancelled;

    date: Date;

    bdate: Date;
    
    constructor(id, slot, studentId, studentNumber, playerid, cancelled?, date?){

        this.id = id;

        this.slot = slot;

        this.studentId = studentId;

        this.studentNumber = studentNumber;

        this.playerid = playerid;
        
        this.cancelled = cancelled ? cancelled : false;
        if(date == undefined){
            this.date = null;
        }else{

            this.date = date.toDate();
        }

    }
}