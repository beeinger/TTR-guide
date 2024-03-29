use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerateStatisticsMessage {
    pub stat_id: String,
    pub positions: Vec<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatisticsApiResponse {
    pub generation_queued: bool,
    pub statistics: Option<PositionStatistics>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PositionStatistics {
    pub stat_id: String,
    pub timestamp: i64,
    pub positions: Vec<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub tech_statistics: Vec<TechStatistics>,
    pub total_jobs_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TechStatistics {
    pub tech: String,
    pub popularity: f32,
    pub count: u32,
    pub location_statistics: LocationStatistics,
    pub type_statistics: TypeStatistics,
    pub salary_statistics: SalaryStatistics,
    pub popularity_statistics: Vec<PopularityStatistics>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocationStatistics {
    pub remote: u32,
    pub office: u32,
    pub hybrid: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TypeStatistics {
    pub full_time: u32,
    pub part_time: u32,
    pub freelance: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SalaryStatistics {
    pub all: Vec<f32>,
    pub max: u32,
    pub upper_quartile: u32,
    pub median: u32,
    pub lower_quartile: u32,
    pub min: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PopularityStatistics {
    pub date: String,
    pub popularity: f32,
    pub count: u32,
}
