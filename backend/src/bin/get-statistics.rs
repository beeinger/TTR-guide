use api::modules::statistics::types::PositionStatistics;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde_json::json;

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let position_statistics: PositionStatistics = PositionStatistics {
        position: "".to_string(),
        start_date: "".to_string(),
        end_date: "".to_string(),
        tech_statistics: Vec::new(),
    };

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
