use crate::modules::{config::get_statistics_table_name, statistics::types::PositionStatistics};
use rusoto_core::Region;
use rusoto_dynamodb::{AttributeValue, DynamoDb, DynamoDbClient, GetItemInput, PutItemInput};
use std::{collections::HashMap, error::Error};

pub async fn get(stat_id: String) -> Result<PositionStatistics, Box<dyn Error + Send>> {
    let client = DynamoDbClient::new(Region::EuWest2);
    let mut key = HashMap::new();
    key.insert(
        "statId".to_string(),
        AttributeValue {
            s: Some(stat_id.to_string()),
            ..Default::default()
        },
    );
    let input = GetItemInput {
        table_name: get_statistics_table_name(),
        key,
        ..Default::default()
    };
    match client.get_item(input).await {
        Ok(output) => {
            if let Some(item) = output.item {
                match serde_dynamodb::from_hashmap(item) {
                    Ok(stat) => Ok(stat),
                    Err(err) => Err(Box::new(err)),
                }
            } else {
                Err(Box::new(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "Item not found in the table",
                )))
            }
        }
        Err(err) => Err(Box::new(err)),
    }
}

pub async fn put(stat: &PositionStatistics) -> Result<(), Box<dyn Error + Send>> {
    let client = DynamoDbClient::new(Region::EuWest2);

    let item = serde_dynamodb::to_hashmap(stat).unwrap();
    let input = PutItemInput {
        table_name: get_statistics_table_name(),
        item,
        ..Default::default()
    };

    match client.put_item(input).await {
        Ok(_) => Ok(()),
        Err(err) => Err(Box::new(err)),
    }
}
