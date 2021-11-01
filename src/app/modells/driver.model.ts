import { Bus } from "./bus.model";
import { User } from "./user.model";

export class Driver extends User{
    phone;
    bus: Bus;

    constructor(id, firstname, lastname, phone, email, imgURL, bus?){
        
        super(id, firstname, lastname, email, imgURL)

        this.phone = phone;
        this.bus = bus ? bus : null;

       
    }
}