use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde_json::{json, Value};
use std::error::Error;

use super::config;

pub mod preprocess;
pub mod types;

pub async fn extract_job_details(
    job_description: &str,
) -> Result<types::ExtractedDescription, Box<dyn Error>> {
    let prompt = "Extract job position (1-2 words, lowercase), tools, technologies, and work flexibility (1 word: remote, on-site, hybrid, flexible) from the job description. Return JSON: {'position': '', 'technologies': [''], 'work_flexibility': ''}. If information is missing, use 'null'.".to_string();

    let preprocessed_description = preprocess::preprocess(job_description)?;

    let url = "https://api.openai.com/v1/chat/completions";
    let headers = {
        let mut headers = HeaderMap::new();
        headers.insert(
            AUTHORIZATION,
            HeaderValue::from_str(&format!("Bearer {}", config::get_gpt_api_key()))?,
        );
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        headers
    };
    let body = json!({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": prompt
            },
            {
                "role":"user",
                "content": preprocessed_description
            }
        ],
        "temperature": 0,
    });
    let client = reqwest::Client::new();
    let response = client.post(url).headers(headers).json(&body).send().await?;
    let response_json: Value = response.json().await?;
    let content = response_json["choices"][0]["message"]["content"].as_str();

    if let Some(valid_content) = content {
        let result = valid_content.trim().replace('\'', "\"");
        let parsed_result: self::types::ExtractedDescription =
            serde_json::from_str(result.as_str())?;
        Ok(parsed_result)
    } else {
        Err(format!("Unable to extract content from response {:?}", content).into())
    }
}
