use api::modules::{
    db::job_posts::{get_all, put_many},
    reed_api::types::JobDetails,
};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;

async fn function_handler(_event: LambdaEvent<IgnoreEvent>) -> Result<(), Error> {
    let all_items = match get_all().await {
        Ok(all_items) => all_items,
        Err(e) => {
            tracing::error!("Error finding all items: {:?}", e);
            return Err(format!("{:?}", e).into());
        }
    };

    let updates: Vec<JobDetails> = all_items
        .into_iter()
        .map(|item| {
            let mut job_details = item;
            //? Lowercase the job title and description
            job_details.job_description = job_details
                .job_description
                .map(|job_description| job_description.to_lowercase());
            job_details.job_title = job_details
                .job_title
                .map(|job_title| job_title.to_lowercase());
            job_details.position = job_details.position.map(|position| position.to_lowercase());
            job_details.work_flexibility = job_details
                .work_flexibility
                .map(|work_flexibility| work_flexibility.to_lowercase());
            job_details.technologies = job_details.technologies.map(|technologies| {
                technologies
                    .iter()
                    .map(|technology| {
                        technology
                            .as_ref()
                            .map(|technology| technology.to_lowercase())
                    })
                    .collect()
            });

            job_details
        })
        .collect();

    match put_many(updates).await {
        Ok(_) => tracing::info!("Successfully updated all items"),
        Err(e) => {
            tracing::error!("Error updating all items: {:?}", e);
            return Err(format!("{:?}", e).into());
        }
    }

    Ok(())
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

#[derive(Deserialize)]
pub struct IgnoreEvent {}
