use api::modules::{
    config::get_process_job_queue_url,
    process_job::{process_job, types::ProcessJobMessage},
};
use aws_lambda_events::event::sqs::SqsEvent;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use rusoto_core::Region;
use rusoto_sqs::{DeleteMessageRequest, Sqs, SqsClient};

async fn function_handler(event: LambdaEvent<SqsEvent>) -> Result<(), Error> {
    for record in event.payload.records {
        if let Some(body) = record.body {
            let sqs_message = serde_json::from_str::<ProcessJobMessage>(&body)?;

            match process_job(sqs_message.job.clone()).await {
                Ok(_) => tracing::info!("Processed jobId: {}", sqs_message.job.job_id),
                Err(e) => tracing::error!("Error processing job: {:?}", e),
            }

            let sqs_client = SqsClient::new(Region::EuWest2);
            let delete_request = DeleteMessageRequest {
                queue_url: get_process_job_queue_url(),
                receipt_handle: record.receipt_handle.unwrap(),
            };
            if let Err(e) = sqs_client.delete_message(delete_request).await {
                tracing::error!("Error deleting message: {:?}", e);
            }
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
