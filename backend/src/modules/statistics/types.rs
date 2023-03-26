use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionStatistics {
    pub position: String,
    pub start_date: String,
    pub end_date: String,
    pub tech_statistics: Vec<TechStatistics>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TechStatistics {
    pub tech: String,
    pub popularity: u32,
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
    pub contract: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SalaryStatistics {
    pub max: u32,
    pub upper_whisker: u32,
    pub upper_quartile: u32,
    pub median: u32,
    pub lower_quartile: u32,
    pub lower_whisker: u32,
    pub min: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PopularityStatistics {
    pub date: String,
    pub popularity: u32,
    pub count: u32,
}