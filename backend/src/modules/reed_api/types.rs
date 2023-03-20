use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JobDetails {
    pub employer_id: u32,
    pub job_id: i64,
    pub employer_name: Option<String>,
    pub job_title: Option<String>,
    pub location_name: Option<String>,
    pub minimum_salary: Option<f32>,
    pub maximum_salary: Option<f32>,
    pub yearly_minimum_salary: Option<f32>,
    pub yearly_maximum_salary: Option<f32>,
    pub currency: Option<String>,
    pub salary_type: Option<String>,
    pub salary: Option<String>,
    pub date_posted: Option<String>,
    pub expiration_date: Option<String>,
    pub external_url: Option<String>,
    pub job_url: String,
    pub part_time: Option<bool>,
    pub full_time: Option<bool>,
    pub contract_type: Option<String>,
    pub job_description: Option<String>,
    pub application_count: Option<u32>,
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct JobPreview {
    pub job_id: u32,
    pub employer_id: u32,
    pub employer_name: Option<String>,
    pub employer_profile_id: Option<u32>,
    pub employer_profile_name: Option<String>,
    pub job_title: Option<String>,
    pub location_name: Option<String>,
    pub minimum_salary: Option<f32>,
    pub maximum_salary: Option<f32>,
    pub currency: Option<String>,
    pub expiration_date: Option<String>,
    pub date: Option<String>,
    pub job_description: Option<String>,
    pub applications: Option<u32>,
    pub job_url: String,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JobSearchResult {
    pub results: Vec<JobPreview>,
    pub total_results: u32,
    pub ambiguous_locations: Vec<String>,
}
