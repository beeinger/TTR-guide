use self::{
    sqs::add_statistics_to_sqs,
    types::{
        GenerateStatisticsMessage, LocationStatistics, PositionStatistics, SalaryStatistics,
        TechStatistics, TypeStatistics,
    },
};
use super::{
    db::{self, job_posts::query_for_positions},
    reed_api::types::JobDetails,
};
use std::collections::HashMap;

pub mod sqs;
pub mod types;

pub async fn queue_statistics_generation(
    positions: Vec<String>,
    start_date: Option<String>,
    end_date: Option<String>,
) -> Result<(), String> {
    let message = GenerateStatisticsMessage {
        stat_id: get_stat_id(positions.clone(), start_date.clone(), end_date.clone()),
        positions,
        start_date,
        end_date,
    };

    add_statistics_to_sqs(message).await.map_err(|e| {
        tracing::error!("Error scheduling statistics generation: {:?}", e);
        format!("{:?}", e)
    })?;

    Ok(())
}

pub async fn calculate_and_save_statistics(
    positions: Vec<String>,
    start_date: Option<String>,
    end_date: Option<String>,
) -> Result<PositionStatistics, String> {
    let all_jobs = query_for_positions(positions.clone(), start_date.clone(), end_date.clone())
        .await
        .map_err(|e| {
            tracing::error!("Error finding all jobs: {:?}", e);
            format!("{:?}", e)
        })?;

    let statistics = calculate_position_statistics(positions, start_date, end_date, all_jobs);

    db::statistics::put(&statistics).await.map_err(|e| {
        tracing::error!("Error putting statistics: {:?}", e);
        format!("{:?}", e)
    })?;

    Ok(statistics)
}

pub fn get_stat_id(
    positions: Vec<String>,
    start_date: Option<String>,
    end_date: Option<String>,
) -> String {
    let mut positions = positions;
    positions.sort();
    let positions = positions.join(",");

    let start_date = match start_date {
        Some(start_date) => start_date,
        None => "None".to_string(),
    };

    let end_date = match end_date {
        Some(end_date) => end_date,
        None => "None".to_string(),
    };

    format!("{}-{}-{}", positions, start_date, end_date)
}

pub fn calculate_position_statistics(
    positions: Vec<String>,
    start_date: Option<String>,
    end_date: Option<String>,
    mut all_jobs: Vec<JobDetails>,
) -> PositionStatistics {
    let mut position_statistics = PositionStatistics {
        stat_id: get_stat_id(positions.clone(), start_date.clone(), end_date.clone()),
        timestamp: chrono::Utc::now().timestamp(),
        positions,
        start_date,
        end_date,
        tech_statistics: Vec::new(),
        total_jobs_count: all_jobs.len() as u32,
    };

    let mut tech_to_statistics = HashMap::new();
    let mut total_count = 0;
    while !all_jobs.is_empty() {
        let job = all_jobs.drain(..1).next().unwrap();
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

            if let Some(contract_type) = job.contract_type {
                if contract_type.contains("Temporary") || contract_type.contains("Contract") {
                    type_statistics.freelance += 1;
                };
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

            if let Some(salary) = match (job.yearly_maximum_salary, job.yearly_minimum_salary) {
                (Some(max), Some(min)) => Some((max + min) / 2.0),
                (Some(max), None) => Some(max),
                (None, Some(min)) => Some(min),
                (None, None) => None,
            } {
                salary_statistics.all.push(salary);
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
                        tech,
                        popularity: 0.0,
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
            total_count += 1;
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

    position_statistics.tech_statistics = tech_to_statistics
        .into_values()
        .map(|mut tech| {
            //? popularity
            tech.popularity = tech.count as f32 / total_count as f32;

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

            salary_stats.all.clear();
            tech
        })
        .collect::<Vec<TechStatistics>>();

    position_statistics
        .tech_statistics
        .sort_by(|a, b| b.count.partial_cmp(&a.count).unwrap());

    if position_statistics.tech_statistics.len() > 1000 {
        position_statistics.tech_statistics.drain(1000..);
    }

    position_statistics
}
