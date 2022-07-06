import {Address} from './address.modal';
import { WorkExperience } from './experience.modal.ts';

export class JobSeeker {
    id: string;
    name: string;
    mobile: string;
    email: string;
    gender: string;
    dob: Date;
    deviceToken: string;
    address: Address;
    averageRating: number;

    emergencyContact: EmergencyContact;
    workExperiences: WorkExperience[];

    profilePhoto: string;
    photos: string[];

    status: string;
    isDelete: boolean;
    createdOn: Date;
    updatedOn: Date;
    updatedBy: string;
    createdBy: string;
}

export class EmergencyContact {
    address: string;
    mobile: string;
    email: string;
}