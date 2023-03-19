#[tokio::test]
#[tracing_test::traced_test]
pub async fn get_job_details() {
    let job_details = crate::modules::reed_api::get_job_details(49731603)
        .await
        .unwrap();
    tracing::info!("{:?}", job_details);
    assert!(job_details.job_id == 49731603);
}
