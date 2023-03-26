use super::{db, reed_api::types::JobDetails};

pub mod sqs;
pub mod types;

pub async fn process_job(job: JobDetails) -> Result<(), Box<dyn std::error::Error>> {
    let job_description = match job.job_description.clone() {
        Some(description) => description,
        None => {
            tracing::warn!("Job description is empty");
            return Ok(());
        }
    };
    let processed_job = match super::gpt::extract_job_details(job_description.as_str()).await {
        Ok(job) => job,
        Err(e) => {
            tracing::error!("Error processing job: {:?}", e);
            return Ok(());
        }
    };
    let job_update = JobDetails {
        position: processed_job.position,
        technologies: processed_job.technologies,
        work_flexibility: processed_job.work_flexibility,
        processed: Some(true),
        ..job
    };
    db::put_many_job_posts(Vec::from([job_update])).await?;

    Ok(())
}
