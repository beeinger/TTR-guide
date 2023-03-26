use rusoto_core::Region;
use rusoto_sqs::{SendMessageBatchRequest, SendMessageBatchRequestEntry, Sqs, SqsClient};

use crate::modules::{config, reed_api::types::JobDetails};
use uuid::Uuid;

use super::types::ProcessJobMessage;

pub async fn add_jobs_to_sqs(jobs: Vec<JobDetails>) -> Result<(), Box<dyn std::error::Error>> {
    let sqs_client = SqsClient::new(Region::default());
    let queue_url = config::get_process_job_queue_url();

    let chunk_size = 10;
    let chunks = jobs.chunks(chunk_size);

    for chunk in chunks {
        let mut entries = Vec::new();
        for job in chunk {
            let message = ProcessJobMessage { job: job.clone() };
            let message_body = serde_json::to_string(&message)?;
            let entry = SendMessageBatchRequestEntry {
                id: Uuid::new_v4().to_string(),
                message_body,
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
