use super::reed_api::types::JobDetails;
use futures::future::join_all;
use rusoto_core::Region;
use rusoto_dynamodb::{BatchWriteItemInput, DynamoDb, DynamoDbClient, PutRequest, WriteRequest};

pub async fn put_many_job_posts(
    job_posts: Vec<JobDetails>,
) -> Result<(), Box<dyn std::error::Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);
    let table_name = std::env::var("TABLE_NAME").unwrap();
    let chunks = job_posts.chunks(25);

    let tasks = chunks.map(|chunk| {
        let put_requests = chunk
            .iter()
            .map(|job_post| {
                let item = serde_dynamodb::to_hashmap(job_post).unwrap();
                WriteRequest {
                    put_request: Some(PutRequest { item }),
                    delete_request: None,
                }
            })
            .collect();

        let request_items = [(table_name.to_string(), put_requests)]
            .iter()
            .cloned()
            .collect();

        let batch_write_input = BatchWriteItemInput {
            request_items,
            ..Default::default()
        };

        client.batch_write_item(batch_write_input)
    });

    let results = join_all(tasks).await;

    for (i, result) in results.into_iter().enumerate() {
        match result {
            Ok(response) => {
                if let Some(unprocessed_items) = response.unprocessed_items {
                    if !unprocessed_items.is_empty() {
                        tracing::info!("Unprocessed items in batch {}: {:?}", i, unprocessed_items);
                    }
                }
            }
            Err(e) => {
                tracing::error!("Error in batch {}: {:?}", i, e);
            }
        }
    }

    Ok(())
}
