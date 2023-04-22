export class Address {
    address: string;
    city: string;
    country: string;
    latitude: any;
    longitude: any;
    placeId: string;
    region: string;
    zip: string;
    distance: number;

    constructor(latitude?: any, longitude?: any) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
