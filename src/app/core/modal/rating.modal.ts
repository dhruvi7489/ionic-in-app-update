export class Rating {

  id: string;
  employerId: string;
  employmentId: string;

  jobSeekerId: string;
  jobSeekerName: string; // for request only
  rating: number;
  review: string;
  reviewTypes: string[];



  updatedBy: string;
  updatedOn: string;
  createdBy: string;
  createdOn: string;
  deleteBy: string;
  isDelete: boolean;
}
