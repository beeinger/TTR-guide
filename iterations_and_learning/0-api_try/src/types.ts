export interface JobPost {
  jobId: number;
  employerId: number;
  employerName: string;
  employerProfileId: number;
  employerProfileName: string;
  jobTitle: string;
  locationName: string | null;
  minimumSalary: number | null;
  maximumSalary: number | null;
  currency: string | null;
  expirationDate: string;
  date: string;
  jobDescription: string;
  applications: number;
  jobUrl: string;
}

export interface JobPostWithDetails extends JobPost {
  yearlyMinimumSalary: number | null;
  yearlyMaximumSalary: number | null;
  salaryType: string;
  salary: number | null;
  datePosted: string;
  externalUrl: string | null;
  fullTime: boolean;
  partTime: boolean;
  contractType: string;
  //? It also has updated job description, which is way longer than the one in JobPost
}
