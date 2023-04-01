use api::modules::{
    config::get_generate_statistics_queue_url,
    statistics::{calculate_and_save_statistics, types::GenerateStatisticsMessage},
};
use aws_lambda_events::event::sqs::SqsEvent;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use rusoto_core::Region;
use rusoto_sqs::{DeleteMessageRequest, Sqs, SqsClient};

async fn function_handler(event: LambdaEvent<SqsEvent>) -> Result<(), Error> {
    tracing::info!("Received event: {:?}", event);
    for record in event.payload.records {
        if let Some(body) = record.body {
            tracing::info!("Processing message: {}", body);
            let sqs_message = serde_json::from_str::<GenerateStatisticsMessage>(&body)?;

            match calculate_and_save_statistics(
                sqs_message.positions,
                sqs_message.start_date,
                sqs_message.end_date,
            )
            .await
            {
                Ok(_) => tracing::info!("Processed statId: {}", sqs_message.stat_id),
                Err(e) => tracing::error!("Error processing stat: {:?}", e),
            }

            let sqs_client = SqsClient::new(Region::EuWest2);
            let delete_request = DeleteMessageRequest {
                queue_url: get_generate_statistics_queue_url(),
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
