use api::modules::{
    db::{self},
    statistics::{self, queue_statistics_generation, types::StatisticsApiResponse},
};
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use url::form_urlencoded;

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let query = form_urlencoded::parse(event.uri().query().unwrap_or("").as_bytes());
    let mut positions: Vec<String> = query
        .filter(|(key, _)| key == "positions")
        .flat_map(|(_, value)| value.split(',').map(|s| s.to_string()).collect::<Vec<_>>())
        .collect();
    if positions.is_empty() {
        positions = vec!["".to_string()];
    }
    let count_threshold: Option<usize> = query
        .filter(|(key, value)| key == "count_threshold" && value != "")
        .flat_map(|(_, value)| value.parse::<usize>().ok())
        .collect::<Vec<_>>()
        .first()
        .cloned();
    let start_date: Option<String> = query
        .filter(|(key, value)| key == "start_date" && value != "")
        .flat_map(|(_, value)| value.parse::<String>().ok())
        .collect::<Vec<_>>()
        .first()
        .cloned();
    let end_date: Option<String> = query
        .filter(|(key, value)| key == "end_date" && value != "")
        .flat_map(|(_, value)| value.parse::<String>().ok())
        .collect::<Vec<_>>()
        .first()
        .cloned();

    let stat_id = statistics::get_stat_id(positions.clone(), start_date.clone(), end_date.clone());
    let cached_statistics_result = db::statistics::get(stat_id).await;

    let mut api_response = StatisticsApiResponse {
        generation_queued: false,
        statistics: None,
    };

    //? Cached statistics object or None
    api_response.statistics = if let Ok(mut cached_statistics) = cached_statistics_result {
        //? If the cache is stale, schedule revalidation.
        if cached_statistics.timestamp + 60 * 60 * 24 <= chrono::Utc::now().timestamp() {
            api_response.generation_queued = true;
            queue_statistics_generation(positions.clone(), start_date.clone(), end_date.clone())
                .await?;
        }

        //? If there was a count threshold, remove the excess statistics.
        if let Some(threshold) = count_threshold {
            if cached_statistics.tech_statistics.len() > threshold {
                cached_statistics.tech_statistics.drain(threshold..);
            }
        }

        //? If cache exists return it.
        Some(cached_statistics)
    } else {
        api_response.generation_queued = true;
        //? If there is no cached statistics object, schedule generation.
        queue_statistics_generation(positions, start_date, end_date).await?;
        //? If cache does not exist, return None.
        None
    };

    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(Body::from(serde_json::to_string(&api_response)?))
        .map_err(Box::new)?;
    Ok(resp)
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
