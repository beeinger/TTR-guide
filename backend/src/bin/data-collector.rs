use api::modules::{
    db::{filter_existing_items, put_many_job_posts},
    reed_api::{get_job_details, get_jobs_previews, types::JobDetails},
};
use futures::future::join_all;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;

const MAX_REQUESTS: i32 = 2_000;
const REQUESTS_SAFETY_MARGIN: i32 = 10;

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(_event: LambdaEvent<IgnoreEvent>) -> Result<String, Error> {
    let mut all_new_jobs: Vec<i64> = Vec::new();
    let mut requests_left: i32 = MAX_REQUESTS - REQUESTS_SAFETY_MARGIN;
    let mut skip = 0;
    //? Do it as long as we are able to get previews and at least one details, at least 2 requests are left
    while requests_left >= (all_new_jobs.len() as i32 + 2) {
        let jobs_previews = match get_jobs_previews(Some(skip)).await {
            Ok(jobs) => jobs,
            Err(e) => {
                tracing::error!("Error getting jobs previews: {}", e);
                return Err(format!("Error getting jobs previews {}", e).into());
            }
        };
        tracing::info!("Job previews: {:?}", jobs_previews);
        //? We did a request above, so decrease the number of requests left
        requests_left -= 1;
        //? For the next iteration we will skip the jobs we got in this iteration
        skip += jobs_previews.results.len() as u32;

        let new_jobs = match filter_existing_items(
            jobs_previews
                .results
                .into_iter()
                .map(|job| job.job_id)
                .collect(),
        )
        .await
        {
            Ok(jobs) => jobs,
            Err(e) => {
                tracing::error!("Error filtering existing jobs: {}", e);
                return Err(format!("Error filtering existing jobs {}", e).into());
            }
        };
        //? We are about to request details for all new jobs, so decrease the number of requests left
        requests_left -= new_jobs.len() as i32;
        //? add the new jobs to the list of all new jobs
        all_new_jobs = all_new_jobs.into_iter().chain(new_jobs.clone()).collect();
        //? If the skip is bigger than the total number of results, then we have already got all the jobs
        if jobs_previews.total_results <= skip {
            break;
        }
    }
    tracing::info!("New jobs: {:?}", all_new_jobs);

    let tasks = all_new_jobs.iter().map(|job_id| get_job_details(*job_id));
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
