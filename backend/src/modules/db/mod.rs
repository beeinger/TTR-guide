use super::{config, reed_api::types::JobDetails};
use futures::future::join_all;
use rusoto_core::Region;
use rusoto_dynamodb::{
    AttributeValue, BatchGetItemInput, BatchWriteItemInput, DynamoDb, DynamoDbClient, GetItemInput,
    KeysAndAttributes, PutRequest, ScanInput, WriteRequest,
};
use std::{collections::HashMap, error::Error};

pub async fn put_many_job_posts(
    job_posts: Vec<JobDetails>,
) -> Result<(), Box<dyn std::error::Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);
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

        let request_items = [(config::get_table_name(), put_requests)]
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

pub async fn get_item(job_id: i64) -> Result<JobDetails, Box<dyn Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);
    let mut key = HashMap::new();
    key.insert(
        "jobId".to_string(),
        AttributeValue {
            n: Some(job_id.to_string()),
            ..Default::default()
        },
    );
    let input = GetItemInput {
        table_name: config::get_table_name(),
        key,
        ..Default::default()
    };
    match client.get_item(input).await {
        Ok(output) => Ok(serde_dynamodb::from_hashmap(output.item.unwrap()).unwrap()),
        Err(err) => Err(Box::new(err)),
    }
}

pub async fn filter_existing_items(
    job_ids: Vec<i64>,
) -> Result<Vec<i64>, Box<dyn std::error::Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);
    let max_batch_size = 100;

    let mut existing_ids = Vec::new();

    for job_ids_chunk in job_ids.chunks(max_batch_size) {
        let mut keys = Vec::new();
        for id in job_ids_chunk {
            let mut key = HashMap::new();
            key.insert(
                "jobId".to_string(),
                AttributeValue {
                    n: Some(id.to_string()),
                    ..Default::default()
                },
            );
            keys.push(key);
        }

        let request_items = vec![(
            config::get_table_name(),
            KeysAndAttributes {
                keys,
                ..Default::default()
            },
        )]
        .into_iter()
        .collect();

        let input = BatchGetItemInput {
            request_items,
            ..Default::default()
        };

        let response = client.batch_get_item(input).await?;

        if let Some(items) = response
            .responses
            .and_then(|mut r| r.remove(&config::get_table_name()))
        {
            for item in items {
                if let Some(id_attr) = item.get("jobId") {
                    // Changed "job_id" to "jobId"
                    if let Some(id_str) = &id_attr.n {
                        if let Ok(id) = id_str.parse::<i64>() {
                            existing_ids.push(id);
                        }
                    }
                }
            }
        }
    }

    let non_existing_ids: Vec<i64> = job_ids
        .into_iter()
        .filter(|id| !existing_ids.contains(id))
        .collect();
    Ok(non_existing_ids)
}

pub async fn find_not_processed() -> Result<Vec<JobDetails>, Box<dyn Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);

    let expression_attribute_names = {
        let mut expression_attribute_names = std::collections::HashMap::new();
        expression_attribute_names.insert("#processed".to_string(), "processed".to_string());
        Some(expression_attribute_names)
    };

    let expression_attribute_values = Some(
        serde_dynamodb::to_hashmap(&serde_json::json!({":processed": true}))
            .unwrap()
            .into_iter()
            .map(|(k, v)| (k, v.into()))
            .collect(),
    );

    let filter_expression =
        Some("attribute_not_exists(#processed) OR #processed <> :processed".to_owned());

    let input = ScanInput {
        table_name: config::get_table_name(),
        filter_expression,
        expression_attribute_values,
        expression_attribute_names,
        ..Default::default()
    };

    let mut items = Vec::new();

    let mut last_evaluated_key = None;
    loop {
        let mut input = input.clone();
        input.exclusive_start_key = last_evaluated_key;

        let output = client.scan(input).await?;
        if let Some(ref keys) = output.last_evaluated_key {
            last_evaluated_key = Some(keys.clone());
        } else {
            last_evaluated_key = None;
        }

        if let Some(ref items_raw) = output.items {
            for item in items_raw {
                let item = serde_dynamodb::from_hashmap(item.clone())?;
                items.push(item);
            }
        }

        if last_evaluated_key.is_none() {
            break;
        }
    }

    Ok(items)
}
