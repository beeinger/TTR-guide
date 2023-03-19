use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde::{Deserialize, Serialize};
use serde_json::json;

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let body = match event.body() {
        Body::Text(body) => body,
        _ => "",
    };
    let body = match serde_json::from_str::<HelloPayload>(body) {
        Ok(body) => body,
        Err(e) => {
            tracing::error!("Error parsing body: {}", e);
            return Ok(Response::builder()
                .status(400)
                .header("content-type", "text/html")
                .body(("Bad Request: ".to_owned() + &e.to_string()).into())
                .map_err(Box::new)?);
        }
    };

    tracing::info!("request body: {:?}", body.hello);

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(Body::from(json!(body).to_string()))
        .map_err(Box::new)?;
    Ok(resp)
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct HelloPayload {
    pub hello: String,
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
