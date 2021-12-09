import { Driver } from './driver.model';

export interface Ambulance {
    id?: string;
    regno: string;
    geo: any[];
    driver: Driver;
}
