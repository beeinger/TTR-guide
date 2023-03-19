use api::modules::reed_api::{get_job_details, get_jobs_previews, types::JobDetails};
use futures::future::join_all;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;
use std::collections::HashMap;

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(_event: LambdaEvent<IgnoreEvent>) -> Result<String, Error> {
    let jobs_previews = match get_jobs_previews(Some(0)).await {
        Ok(jobs) => jobs,
        Err(e) => {
            tracing::error!("Error getting jobs previews: {}", e);
            return Err(format!("Error getting jobs previews {}", e).into());
        }
    };
    let tasks = jobs_previews.iter().map(|job| get_job_details(job.job_id));
    let detailed_jobs: HashMap<u32, JobDetails> = join_all(tasks)
        .await
        .into_iter()
        .filter_map(|result| match result {
            Ok(job_details) => Some((job_details.job_id, job_details)),
            Err(e) => {
                tracing::error!("Error getting job details: {}", e);
                None
            }
        })
        .collect();

    tracing::info!("Got {} jobs", detailed_jobs.len());

    Ok("Success".to_string())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}

#[derive(Deserialize)]
pub struct IgnoreEvent {}
