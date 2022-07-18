export class Attendance {
    content: AttendanceBody[];
}

export class AttendanceBody {
    checkIn: Date;
    checkOut: Date;
    createdBy: string;
    createdOn: Date;
    deleteBy: boolean;
    employmentId: string;
    id: string;
    isCompleted: boolean;
    isDelete: boolean;
    jobSeekerId: string;
    jobSeekerName: string;
    totalRecordedTime: number;
    updatedBy: string;
    updatedOn: Date;

    // for req
    checkInTime: Date
    checkOutTime: Date
}
