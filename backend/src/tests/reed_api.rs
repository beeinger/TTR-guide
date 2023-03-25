#[tokio::test]
#[tracing_test::traced_test]
pub async fn get_job_details() {
    use crate::modules::reed_api;

    let job_details = reed_api::get_job_details(49731603).await.unwrap();
    tracing::info!("{:?}", job_details);
    assert_eq!(job_details.job_id, 49731603);
}

#[tokio::test]
#[tracing_test::traced_test]
pub async fn get_jobs_previews() {
    use crate::modules::reed_api;

    let job_previews = reed_api::get_jobs_previews(None).await.unwrap();
    tracing::info!("{:?}", job_previews);
    assert_eq!(job_previews.results.len(), 100);

    let job_previews_2 = reed_api::get_jobs_previews(Some(99)).await.unwrap();
    tracing::info!("{:?}", job_previews_2);
    assert_eq!(job_previews.results.last(), job_previews_2.results.first());
    assert_eq!(job_previews_2.results.len(), 100);
}
