export class EmploymentHistoryLocationRequest {
    employmentId: string;
    historyDate: Date;
    jobSeekerId: string;
    latitude: number;
    longitude: number;
}


export class EmploymentHistoryImageProofRequest {
    employmentId: string;
    historyDate: Date;
    jobSeekerId: string;
    imagePath: string;
    proofEnum: string;
    description: string;
}

