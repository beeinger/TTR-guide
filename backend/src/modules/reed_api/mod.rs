use self::types::{JobDetails, JobSearchResult};
use super::config;

pub mod types;

pub async fn get_job_details(job_id: i64) -> Result<JobDetails, Box<dyn std::error::Error>> {
    let url = format!("https://www.reed.co.uk/api/1.0/jobs/{}", job_id);
    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .basic_auth(config::get_reed_api_key(), Option::<&str>::None)
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(format!("Error: {}", response.status()).into());
    }

    let mut job_details: JobDetails = response.json().await?;
    //? Lowercase the job title and description
    job_details.job_description = match job_details.job_description {
        Some(job_description) => Some(job_description.to_lowercase()),
        None => None,
    };
    job_details.job_title = match job_details.job_title {
        Some(job_title) => Some(job_title.to_lowercase()),
        None => None,
    };

    Ok(job_details)
}

pub async fn get_jobs_previews(
    skip_first: Option<u32>,
) -> Result<JobSearchResult, Box<dyn std::error::Error>> {
    let url = format!(
        "https://www.reed.co.uk/api/1.0/search?keywords={}&resultsToSkip={}",
        "frontend,backend,fullstack,full stack",
        skip_first.unwrap_or(0)
    );
    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .basic_auth(config::get_reed_api_key(), Option::<&str>::None)
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(format!("Error: {}", response.status()).into());
    }

    let search_result: JobSearchResult = response.json().await?;
    Ok(search_result)
}
