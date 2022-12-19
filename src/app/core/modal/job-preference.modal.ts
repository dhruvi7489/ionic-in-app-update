import { JobType } from "./job-type.modal";

export class JobTypeRequests {
    typeId: string;
    typeName: string;
}

export class jobTypePreferencesRequests {
    typeId: string;
    typeName: string;
}

export class JobPreference {
    availability: Availability[];
    createdBy: string;
    createdOn: string;
    deleteBy: string;
    id: string;
    isDelete: boolean;
    jobSeekerId: string;
    jobTypePreferences: JobTypePreference[];
    maxDistance: any;
    updatedBy: string;
    updatedOn: string;
    jobTypeRequests: JobTypeRequests[];

}

export class Availability {
    dateFrom: any;
    dateTo: any;
    day: string;

}

export class JobCategoryPreference {
    level: string;
    maxHourlyRate: number;
    status: string;
    typeId: string;
    typeName: string;

}

export class JobTypePreference {
    level: string;
    maxHourlyRate: number;
    status: string;
    typeId: string;
    typeName: string;
    shiftHours?: any;
    finalAmount?: any;
    hourlyMinAllowed?: any;
    hourlyMaxAllowed?: any;
    basePrice?: any;
    // non-api
    jobType: JobType;
}