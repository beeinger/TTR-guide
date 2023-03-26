use api::modules::{
    db::{get_all_items, put_many_job_posts},
    reed_api::types::JobDetails,
};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Deserialize;

async fn function_handler(_event: LambdaEvent<IgnoreEvent>) -> Result<(), Error> {
    let all_items = match get_all_items().await {
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
            job_details.job_description = match job_details.job_description {
                Some(job_description) => Some(job_description.to_lowercase()),
                None => None,
            };
            job_details.job_title = match job_details.job_title {
                Some(job_title) => Some(job_title.to_lowercase()),
                None => None,
            };
            job_details.position = match job_details.position {
                Some(position) => Some(position.to_lowercase()),
                None => None,
            };
            job_details.work_flexibility = match job_details.work_flexibility {
                Some(work_flexibility) => Some(work_flexibility.to_lowercase()),
                None => None,
            };
            job_details.technologies = match job_details.technologies {
                Some(technologies) => Some(
                    technologies
                        .iter()
                        .map(|technology| match technology {
                            Some(technology) => Some(technology.to_lowercase()),
                            None => None,
                        })
                        .collect(),
                ),
                None => None,
            };
            job_details
        })
        .collect();

    match put_many_job_posts(updates).await {
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
