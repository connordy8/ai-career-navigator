export interface JobListing {
  id: string;
  title: string;
  employer: string;
  employerLogo?: string;
  location: string;
  isRemote: boolean;
  salary: {
    min: number;
    max: number;
    period: "hourly" | "yearly";
  };
  employmentType: "FULLTIME" | "PARTTIME" | "CONTRACT";
  description: string;
  qualifications: string[];
  benefits: string[];
  postedDaysAgo: number;
  category: string;
  applyLink?: string;
  source?: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  employmentType?: string;
  category?: string;
  page?: number;
  remoteOnly?: boolean;
}
