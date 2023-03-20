use api::modules::{
    db::put_many_job_posts,
    reed_api::{get_job_details, get_jobs_previews, types::JobDetails},
};
use futures::future::join_all;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;

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
    let detailed_jobs: Vec<JobDetails> = join_all(tasks)
        .await
        .into_iter()
        .filter_map(|result| match result {
            Ok(job_details) => Some(job_details),
            Err(e) => {
                tracing::error!("Error getting job details: {}", e);
                None
            }
        })
        .collect();

    tracing::info!("Got {} jobs", detailed_jobs.len());
    match put_many_job_posts(detailed_jobs).await {
        Ok(_) => tracing::info!("Successfully put jobs in DynamoDB"),
        Err(e) => {
            tracing::error!("Error putting jobs in DynamoDB: {}", e);
            return Err(format!("Error putting jobs in DynamoDB: {}", e).into());
        }
    }

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
