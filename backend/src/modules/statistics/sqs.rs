use rusoto_core::Region;
use rusoto_sqs::{SendMessageRequest, Sqs, SqsClient};

use crate::modules::config;

use super::types::GenerateStatisticsMessage;

pub async fn add_statistics_to_sqs(
    message: GenerateStatisticsMessage,
) -> Result<(), Box<dyn std::error::Error>> {
    let sqs_client = SqsClient::new(Region::default());
    let queue_url = config::get_generate_statistics_queue_url();

    let message_body = serde_json::to_string(&message)?;
    let request = SendMessageRequest {
        message_body,
        message_group_id: Some(message.stat_id.clone()),
        message_deduplication_id: Some(message.stat_id),
        queue_url: queue_url.clone(),
        ..Default::default()
    };

    sqs_client.send_message(request).await?;

    Ok(())
}
