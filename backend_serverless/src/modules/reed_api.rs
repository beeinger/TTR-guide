use serde::{Deserialize, Serialize};
// use reqwest::Client;
// use std::env;

// pub fn get_job_details(job_id: u32) -> Result<JobDetails, String> {
//     let client = Client::new();
//     let api_key = env::var("REED_API_KEY").unwrap();
//     let url = format!(
//         "https://www.reed.co.uk/api/1.0/jobs/{}?api_key={}",
//         job_id, api_key
//     );
//     let response = client.get(&url).send().unwrap();
//     let job_details: JobDetails = response.json().unwrap();
//     Ok(job_details)
// }

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct JobDetails {
    employer_id: u32,
    job_id: u32,
    employer_name: Option<String>,
    job_title: Option<String>,
    location_name: Option<String>,
    minimum_salary: Option<f32>,
    maximum_salary: Option<f32>,
    yearly_minimum_salary: Option<f32>,
    yearly_maximum_salary: Option<f32>,
    currency: Option<String>,
    salary_type: Option<String>,
    salary: Option<String>,
    date_posted: Option<String>,
    expiration_date: Option<String>,
    external_url: Option<String>,
    job_url: String,
    part_time: Option<bool>,
    full_time: Option<bool>,
    contract_type: Option<String>,
    job_description: Option<String>,
    application_count: Option<u32>,
}

pub fn get_job_details(job_id: u32) -> Result<JobDetails, String> {
    Ok(JobDetails {
        employer_id: 0,
        job_id: 0,
        employer_name: None,
        job_title: None,
        location_name: None,
        minimum_salary: None,
        maximum_salary: None,
        yearly_minimum_salary: None,
        yearly_maximum_salary: None,
        currency: None,
        salary_type: None,
        salary: None,
        date_posted: None,
        expiration_date: None,
        external_url: None,
        job_url: String::new(),
        part_time: None,
        full_time: None,
        contract_type: None,
        job_description: None,
        application_count: None,
    })
}
