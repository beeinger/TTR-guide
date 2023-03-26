use api::modules::{db::query_data_for_position, statistics::calculate_position_statistics};
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde_json::json;
use url::form_urlencoded;

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let query = form_urlencoded::parse(event.uri().query().unwrap_or("").as_bytes());
    let mut positions: Vec<String> = query
        .clone()
        .filter(|(key, _)| key == "positions")
        .flat_map(|(_, value)| value.split(',').map(|s| s.to_string()).collect::<Vec<_>>())
        .collect();
    if positions.is_empty() {
        positions = vec!["".to_string()];
    }
    let count_threshold: Option<u32> = query
        .clone()
        .filter(|(key, value)| key == "count_threshold" && value != "")
        .flat_map(|(_, value)| value.parse::<u32>().ok())
        .collect::<Vec<_>>()
        .first()
        .cloned();
    let start_date: Option<String> = query
        .clone()
        .filter(|(key, value)| key == "start_date" && value != "")
        .flat_map(|(_, value)| value.parse::<String>().ok())
        .collect::<Vec<_>>()
        .first()
        .cloned();
    let end_date: Option<String> = query
        .clone()
        .filter(|(key, value)| key == "end_date" && value != "")
        .flat_map(|(_, value)| value.parse::<String>().ok())
        .collect::<Vec<_>>()
        .first()
        .cloned();

    let all_jobs = match query_data_for_position(
        positions.clone(),
        start_date.clone(),
        end_date.clone(),
    )
    .await
    {
        Ok(all_jobs) => all_jobs,
        Err(e) => {
            tracing::error!("Error finding all jobs: {:?}", e);
            return Err(format!("{:?}", e).into());
        }
    };

    let position_statistics =
        calculate_position_statistics(positions, start_date, end_date, all_jobs, count_threshold);

    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(Body::from(json!(position_statistics).to_string()))
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
