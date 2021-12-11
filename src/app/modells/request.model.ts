import { Ambulance } from './ambulance.model';
export interface AmbulanceRequest {
    id?: string;
    createdAt?: Date;
    reason?: string;
    geo?: any[];
    ambulance?: Ambulance;
    status?: string;
}
