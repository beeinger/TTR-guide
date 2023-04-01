use crate::modules::{config, reed_api::types::JobDetails};
use rusoto_core::Region;
use rusoto_sqs::{SendMessageBatchRequest, SendMessageBatchRequestEntry, Sqs, SqsClient};
use serde_json::to_string;

use super::types::ProcessJobMessage;

const SQS_FIFO_GROUP_ID: &str = "openai-gpt3";

pub async fn add_jobs_to_sqs(jobs: Vec<JobDetails>) -> Result<(), Box<dyn std::error::Error>> {
    let sqs_client = SqsClient::new(Region::default());
    let queue_url = config::get_process_job_queue_url();

    let chunk_size = 10;
    let chunks = jobs.chunks(chunk_size);

    for chunk in chunks {
        let mut entries = Vec::new();
        for job in chunk {
            let message = ProcessJobMessage { job: job.clone() };
            let message_body = to_string(&message)?;
            let entry = SendMessageBatchRequestEntry {
                id: job.job_id.to_string(),
                message_body,
                message_group_id: Some(SQS_FIFO_GROUP_ID.to_string()),
                message_deduplication_id: Some(job.job_id.to_string()),
                ..Default::default()
            };
            entries.push(entry);
        }

        let request = SendMessageBatchRequest {
            entries,
            queue_url: queue_url.clone(),
        };

        sqs_client.send_message_batch(request).await?;
    }

    Ok(())
}
