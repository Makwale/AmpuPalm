import { Address } from './address.model';

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
}
