export interface StatisticsResponse {
  generation_queued: boolean;
  statistics: PositionStatistics;
}

export interface PositionStatistics {
  positions: string[];
  startDate: string | null;
  endDate: string | null;
  techStatistics: TechStatistics[];
}

export interface TechStatistics {
  tech: string;
  popularity: number;
  count: number;
  location_statistics: LocationStatistics;
  type_statistics: TypeStatistics;
  salary_statistics: SalaryStatistics;
  popularity_statistics: PopularityStatistics[];
  total_jobs_count: number;
}

export interface LocationStatistics {
  remote: number;
  office: number;
  hybrid: number;
}

export interface SalaryStatistics {
  all: number[];
  max: number;
  upper_quartile: number;
  median: number;
  lower_quartile: number;
  min: number;
}

export interface TypeStatistics {
  full_time: number;
  part_time: number;
  freelance: number;
}

export interface PopularityStatistics {
  date: string;
  popularity: number;
  count: number;
}
