import { Time } from "@angular/common";
import { Bus } from "./bus.model";

export class Slot{

    id;

    date: Date;

    bus: Bus;

    from;

    to;

    geo = [];

    availableSeats;

    bookedSeats;

    delivered: boolean;

    gps: boolean = false;

    constructor(id, date, bus, geo, availableSeats, bookedSeats, from, to, gps?, delivered?){

        this.id = id;

        this.date = date.toDate();

        this.bus = bus;

        this.from = from;

        this.to = to;

        this.geo = geo;

        this.availableSeats = availableSeats;

        this.bookedSeats = bookedSeats;

        this.gps = gps;

        this.delivered = delivered == "" ? false : true;
    }

}