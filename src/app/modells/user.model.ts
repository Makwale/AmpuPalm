import { Address } from './address.model';

interface Ambulance {
    regno;
    status;
}
export class User {
    id?;
    firstname?;
    lastname?;
    email?;
    imgURL?;
    address?: Address;
    nxtKinId?;
    nextOfKin?: User;
    playerId?: string;
    phone?: string;
    ambiId?: string;
    ambulance?: Ambulance;
}


