use api::modules::reed_api;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(_event: LambdaEvent<IgnoreEvent>) -> Result<String, Error> {
    let job_details = reed_api::get_job_details(0)?;
    tracing::info!("{}", serde_json::to_string(&job_details).unwrap());

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
