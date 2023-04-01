use api::modules::{db::find_not_processed, process_job::sqs::add_jobs_to_sqs};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;

async fn function_handler(event: LambdaEvent<IgnoreEvent>) -> Result<(), Error> {
    if event.payload.re_process_all == Some(true) {
        tracing::info!("Re-processing all job posts");
    } else {
        let not_processed = match find_not_processed().await {
            Ok(not_processed) => not_processed,
            Err(e) => {
                tracing::error!("Error finding not processed job posts: {:?}", e);
                return Ok(());
            }
        };

        tracing::info!("Found {} not processed job posts.", not_processed.len());

        match add_jobs_to_sqs(not_processed).await {
            Ok(_) => tracing::info!("Added jobs to SQS"),
            Err(e) => tracing::error!("Error adding jobs to SQS: {:?}", e),
        }
    }
    Ok(())
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
pub struct IgnoreEvent {
    pub re_process_all: Option<bool>,
}
