use super::config::Config;

pub mod types;

pub async fn get_job_details(job_id: u32) -> Result<types::JobDetails, Box<dyn std::error::Error>> {
    let url = format!("https://www.reed.co.uk/api/1.0/jobs/{}", job_id);
    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .basic_auth(Config::from_env().reed_api_key, Option::<&str>::None)
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(format!("Error: {}", response.status()).into());
    }

    Ok(response.json().await?)
}
