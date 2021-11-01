export class User{
    id?;
    firstname?;
    lastname?;
    email?;
    imgURL?
    playerid?
    constructor(id, firstname, lastname, email?, imgURL?, playerid?){
        
        this.id = id;

         this.firstname = firstname;

         this.lastname = lastname;

         this.email = email;

         this.imgURL = imgURL;

         this.playerid = playerid
    }
}