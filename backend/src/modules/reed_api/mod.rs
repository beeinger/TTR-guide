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
    job_details.job_description = job_details
        .job_description
        .map(|job_description| job_description.to_lowercase());
    job_details.job_title = job_details
        .job_title
        .map(|job_title| job_title.to_lowercase());

    Ok(job_details)
}

pub async fn get_jobs_previews(
    skip_first: Option<u32>,
) -> Result<JobSearchResult, Box<dyn std::error::Error>> {
    let url = format!(
        "https://www.reed.co.uk/api/1.0/search?keywords={}&resultsToSkip={}",
        "engineer,developer,frontend,backend,full stack,blockchain,web,smart contract,software,js,javascript,ts,typescript,ethereum,web3,python,rust,java,android,ios,coding,programming,flutter,vue,angular,php,scala,go,elixir,dart,swift,fullstack,back end,front end",
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
