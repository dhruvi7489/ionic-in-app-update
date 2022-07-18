export class EmploymentHistory {
    id: string;
    employmentId: string;
    historyDate: string;
    imageProofs: ImageProof[];
    isDelete: boolean;
    jobSeekerId: string;
    locationHistories: LocationHistory[];
    updatedBy: string;
    updatedOn: Date;
    createdBy: string;
    createdOn: Date;
    deleteBy: boolean;
    
}

export interface ImageProof {
    dateTime: Date;
    imagePath: string;
    proofEnum: string;
    uploadedDate:any;

    // for request
}

export interface LocationHistory {
    dateTime: Date;
    latitude: number;
    longitude: number;

    // for request
}

