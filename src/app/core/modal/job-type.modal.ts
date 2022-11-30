export class JobType {
    id: string;
    name: string;
    notes: string;
    jobCategoryName: string;
    jobCategoryId: string;
    // non-api
    isChecked: boolean;
    selected: boolean;
    deleteBy: boolean;
    isDelete: boolean;
    jobSeekerPrices: JobTypePrice[];
    updatedBy: string;
    updatedOn: string;
    createdBy: string;
    createdOn: string;
}

export class JobTypePrice {
    maxHour: number;
    basePrice: number;
    gender: string;
    jobTypeHourlyPriceRange: JobTypeHourlyPriceRange[];
}

export class JobTypeHourlyPriceRange {
    hourlyMax: number;
    hourlyMin: number;
    level: string;
}
