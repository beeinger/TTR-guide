use std::collections::HashMap;

use self::types::{
    LocationStatistics, PositionStatistics, SalaryStatistics, TechStatistics, TypeStatistics,
};

use super::reed_api::types::JobDetails;

pub mod types;

pub fn calculate_position_statistics(
    positions: Vec<String>,
    start_date: Option<String>,
    end_date: Option<String>,
    all_jobs: Vec<JobDetails>,
    count_threshold: Option<u32>,
) -> PositionStatistics {
    let mut position_statistics = PositionStatistics {
        positions,
        start_date,
        end_date,
        tech_statistics: Vec::new(),
    };

    let mut tech_to_statistics = HashMap::new();
    for job in all_jobs {
        let location_statistics = {
            let mut location_statistics = LocationStatistics {
                remote: 0,
                office: 0,
                hybrid: 0,
            };

            match job.work_flexibility {
                Some(work_flexibility) => {
                    if work_flexibility.contains("remot") || work_flexibility.contains("wfh") {
                        location_statistics.remote += 1;
                    } else if work_flexibility.contains("hybrid")
                        || work_flexibility.contains("flexible")
                    {
                        location_statistics.hybrid += 1;
                    } else if work_flexibility.contains("site")
                        || work_flexibility.contains("office")
                    {
                        location_statistics.office += 1;
                    } else {
                        location_statistics.office += 1;
                    }
                }
                None => location_statistics.office += 1,
            };

            location_statistics
        };

        let type_statistics = {
            let mut type_statistics = TypeStatistics {
                full_time: 0,
                part_time: 0,
                freelance: 0,
            };

            match job.contract_type {
                Some(contract_type) => {
                    if contract_type.contains("Temporary") || contract_type.contains("Contract") {
                        type_statistics.freelance += 1;
                    };
                }
                None => (),
            };

            if job.part_time == Some(true) {
                type_statistics.part_time += 1;
            }

            if job.full_time == Some(true) {
                type_statistics.full_time += 1;
            }

            type_statistics
        };

        let mut salary_statistics = {
            let mut salary_statistics = SalaryStatistics {
                all: Vec::new(),
                max: 0,
                upper_quartile: 0,
                median: 0,
                lower_quartile: 0,
                min: 0,
            };

            match match (job.yearly_maximum_salary, job.yearly_minimum_salary) {
                (Some(max), Some(min)) => Some((max + min) / 2.0),
                (Some(max), None) => Some(max),
                (None, Some(min)) => Some(min),
                (None, None) => None,
            } {
                Some(salary) => {
                    salary_statistics.all.push(salary);
                }
                None => (),
            };

            salary_statistics
        };

        for tech in match job.technologies {
            Some(technologies) => technologies,
            None => continue,
        } {
            let tech = match tech {
                Some(tech) => tech,
                None => continue,
            };
            let tech_statistics =
                tech_to_statistics
                    .entry(tech.clone())
                    .or_insert(TechStatistics {
                        tech: tech,
                        popularity: 0,
                        count: 0,
                        location_statistics: LocationStatistics {
                            remote: 0,
                            office: 0,
                            hybrid: 0,
                        },
                        type_statistics: TypeStatistics {
                            full_time: 0,
                            part_time: 0,
                            freelance: 0,
                        },
                        salary_statistics: SalaryStatistics {
                            all: Vec::new(),
                            max: 0,
                            upper_quartile: 0,
                            median: 0,
                            lower_quartile: 0,
                            min: 0,
                        },
                        popularity_statistics: Vec::new(),
                    });
            //? popularity
            tech_statistics.count += 1;
            //? location_statistics
            tech_statistics.location_statistics.remote += location_statistics.remote;
            tech_statistics.location_statistics.office += location_statistics.office;
            tech_statistics.location_statistics.hybrid += location_statistics.hybrid;
            //? type_statistics
            tech_statistics.type_statistics.full_time += type_statistics.full_time;
            tech_statistics.type_statistics.part_time += type_statistics.part_time;
            tech_statistics.type_statistics.freelance += type_statistics.freelance;
            //? salary_statistics
            tech_statistics
                .salary_statistics
                .all
                .append(&mut salary_statistics.all);
        }
    }

    let total_count = tech_to_statistics
        .clone()
        .into_iter()
        .fold(0, |acc, (_, tech)| acc + tech.count);

    position_statistics.tech_statistics = tech_to_statistics
        .into_iter()
        .map(|(_, mut tech)| {
            //? popularity
            tech.popularity = tech.count / total_count;

            //? salary_statistics
            let mut salary_stats = &mut tech.salary_statistics;
            if salary_stats.all.is_empty() {
                return tech;
            }

            // Sort the salaries in ascending order
            salary_stats.all.sort_by(|a, b| a.partial_cmp(b).unwrap());

            // Calculate min and max
            salary_stats.min = *salary_stats.all.first().unwrap() as u32;
            salary_stats.max = *salary_stats.all.last().unwrap() as u32;

            // Calculate median
            let middle = salary_stats.all.len() / 2;
            salary_stats.median = if salary_stats.all.len() % 2 == 0 {
                ((salary_stats.all[middle - 1] + salary_stats.all[middle]) / 2.0) as u32
            } else {
                salary_stats.all[middle] as u32
            };

            // Calculate lower and upper quartiles only if there are more than one elements
            if salary_stats.all.len() > 1 {
                let lower_middle = middle / 2;
                let upper_middle = if salary_stats.all.len() % 2 == 0 {
                    middle + lower_middle
                } else {
                    middle + lower_middle + 1
                };

                salary_stats.lower_quartile = if middle % 2 == 0 {
                    ((salary_stats.all[lower_middle - 1] + salary_stats.all[lower_middle]) / 2.0)
                        as u32
                } else {
                    salary_stats.all[lower_middle] as u32
                };

                salary_stats.upper_quartile = if middle % 2 == 0 {
                    ((salary_stats.all[upper_middle - 1] + salary_stats.all[upper_middle]) / 2.0)
                        as u32
                } else {
                    salary_stats.all[upper_middle] as u32
                };
            }

            tech
        })
        .filter(|tech| match count_threshold {
            Some(count_threshold) => tech.count >= count_threshold,
            None => true,
        })
        .collect();

    position_statistics
}
