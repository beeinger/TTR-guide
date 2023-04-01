use super::super::{config, reed_api::types::JobDetails};
use chrono::NaiveDate;
use futures::future::join_all;
use rusoto_core::Region;
use rusoto_dynamodb::{
    AttributeValue, BatchGetItemInput, BatchWriteItemInput, DynamoDb, DynamoDbClient, GetItemInput,
    KeysAndAttributes, PutRequest, ScanInput, WriteRequest,
};
use std::{collections::HashMap, error::Error};

pub async fn put_many(job_posts: Vec<JobDetails>) -> Result<(), Box<dyn std::error::Error>> {
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

        let request_items = [(config::get_job_posts_table_name(), put_requests)]
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

pub async fn get(job_id: i64) -> Result<JobDetails, Box<dyn Error>> {
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
        table_name: config::get_job_posts_table_name(),
        key,
        ..Default::default()
    };
    match client.get_item(input).await {
        Ok(output) => Ok(serde_dynamodb::from_hashmap(output.item.unwrap()).unwrap()),
        Err(err) => Err(Box::new(err)),
    }
}

pub async fn filter_existing(job_ids: Vec<i64>) -> Result<Vec<i64>, Box<dyn std::error::Error>> {
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
            config::get_job_posts_table_name(),
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
            .and_then(|mut r| r.remove(&config::get_job_posts_table_name()))
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

    let expression_attribute_values =
        Some(serde_dynamodb::to_hashmap(&serde_json::json!({":processed": true})).unwrap());

    let filter_expression =
        Some("attribute_not_exists(#processed) OR #processed <> :processed".to_owned());

    let input = ScanInput {
        table_name: config::get_job_posts_table_name(),
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

pub async fn get_all() -> Result<Vec<JobDetails>, Box<dyn std::error::Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);
    let table_name = config::get_job_posts_table_name();

    let mut job_details: Vec<JobDetails> = Vec::new();
    let mut last_evaluated_key: Option<HashMap<String, AttributeValue>> = None;

    loop {
        let scan_input = ScanInput {
            table_name: table_name.clone(),
            exclusive_start_key: last_evaluated_key.clone(),
            ..Default::default()
        };

        let result = client.scan(scan_input).await?;
        let items = result.items.unwrap_or_default();

        for item in items {
            if let Ok(job) = serde_dynamodb::from_hashmap(item) {
                job_details.push(job);
            }
        }

        last_evaluated_key = result.last_evaluated_key;
        if last_evaluated_key.is_none() {
            break;
        }
    }

    Ok(job_details)
}

pub async fn query_for_positions(
    positions: Vec<String>,
    start_date: Option<String>,
    end_date: Option<String>,
) -> Result<Vec<JobDetails>, Box<dyn std::error::Error>> {
    let chunk_size = 100 / 3;
    let mut all_job_details: HashMap<String, JobDetails> = HashMap::new();

    for position_chunk in positions.chunks(chunk_size) {
        let mut job_details =
            query_for_position_chunk(position_chunk.to_vec(), &start_date, &end_date).await?;
        all_job_details.extend(job_details.drain());
    }

    Ok(all_job_details.into_iter().map(|(_, v)| v).collect())
}

async fn query_for_position_chunk(
    positions: Vec<String>,
    start_date: &Option<String>,
    end_date: &Option<String>,
) -> Result<HashMap<String, JobDetails>, Box<dyn std::error::Error>> {
    let client = DynamoDbClient::new(Region::EuWest2);
    let table_name = config::get_job_posts_table_name();

    let start_date = start_date
        .as_ref()
        .map(|date| NaiveDate::parse_from_str(date, "%d/%m/%Y"))
        .transpose()?;
    let end_date = end_date
        .as_ref()
        .map(|date| NaiveDate::parse_from_str(date, "%d/%m/%Y"))
        .transpose()?;

    let mut expression_attribute_values = HashMap::new();
    let mut expression_attribute_names = HashMap::new();
    let mut filter_expression_parts = Vec::new();
    for (i, position) in positions.iter().enumerate() {
        let position_key = format!(":position_val{}", i);
        let position_name_key = format!("#position_name{}", i);

        expression_attribute_values.insert(
            position_key.clone(),
            AttributeValue {
                s: Some(position.to_string()),
                ..Default::default()
            },
        );

        expression_attribute_names.insert(position_name_key.clone(), "position".to_string());

        filter_expression_parts.push(format!(
            "contains({}, {}) OR contains(jobTitle, {}) OR contains(jobDescription, {})",
            position_name_key, position_key, position_key, position_key
        ));
    }

    let filter_expression = filter_expression_parts.join(" OR ");

    let scan_input = ScanInput {
        table_name,
        filter_expression: Some(filter_expression),
        expression_attribute_values: Some(expression_attribute_values),
        expression_attribute_names: Some(expression_attribute_names),
        ..Default::default()
    };

    let mut job_details: HashMap<String, JobDetails> = HashMap::new();
    let mut last_evaluated_key: Option<HashMap<String, AttributeValue>> = None;

    loop {
        let mut scan_input = scan_input.clone();
        scan_input.exclusive_start_key = last_evaluated_key.clone();

        let result = client.scan(scan_input.clone()).await?;
        let items = result.items.unwrap_or_default();

        for item in items {
            if let Ok(job) = serde_dynamodb::from_hashmap::<JobDetails, _>(item) {
                let job_date_posted = match job.date_posted.clone() {
                    Some(date) => NaiveDate::parse_from_str(&date, "%d/%m/%Y")?,
                    None => continue,
                };

                let is_within_range = match (&start_date, &end_date) {
                    (Some(start), Some(end)) => {
                        job_date_posted >= *start && job_date_posted <= *end
                    }
                    (Some(start), None) => job_date_posted >= *start,
                    (None, Some(end)) => job_date_posted <= *end,
                    (None, None) => true,
                };

                if is_within_range {
                    job_details.insert(job.job_id.to_string(), job);
                }
            }
        }

        last_evaluated_key = result.last_evaluated_key;
        if last_evaluated_key.is_none() {
            break;
        }
    }

    Ok(job_details)
}
