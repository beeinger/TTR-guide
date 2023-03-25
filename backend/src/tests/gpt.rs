#[tokio::test]
#[tracing_test::traced_test]
pub async fn extract_job_details() {
    use crate::modules::gpt;

    let example_description = "<p><strong>Full Stack Engineer - Java/React</strong></p> <p>Salary: Up to &#163;75,000 &#43; benefits</p> <p>Location: Fully remote. You must be available to go to face-to-face team meetings in Oxford 1-2 times a month.</p> <p><strong>Like the sound of working on projects using AI-augmented coding to change the way Developers code?</strong></p> <p><strong>Enjoy a Backend and Frontend mix?</strong></p> <p>An expanding software house using AI for code are looking for a Full Stack Engineer to join their team. They are a spin-out from Oxford University. Their products help developers and organisations to achieve faster delivery of high-quality code. This company  currently has over 50 employees and received over $30million in Series A funding.</p> <p>Tech stack: <strong>Java (50%), React (50%), Spring, PostgreSQL, Docker, Kubernetes</strong></p> <p>They are hiring across all levels of seniority from Mid to Senior Full Stack Engineers.</p> <p>They believe in clean code and BDD/TDD and that is something they really value, as well as working with agile methodologies and with CI/CD pipelines. You will design and develop fast and reliable systems and work as part of a team delivering customers via  a fantastic user experience in a fast-paced rapidly changing environment.</p> <p>Benefits for this Full Stack Engineer opportunity:</p> <ul> <li>Shares</li><li>8% non-contributory pension</li><li>Medical, dental and life insurance</li></ul> <p><strong>If you are excited about this opportunity to join a growing AI scale-up as a Full Stack Engineer - Java/React, apply now!</strong></p> <p>Understanding Recruitment is serving as the employment agency for this job opening.</p>";

    let extracted_description = gpt::extract_job_details(example_description).await.unwrap();

    tracing::info!("{:?}", extracted_description);

    assert_eq!(
        extracted_description.position,
        Some("full stack engineer".to_string())
    );
    assert_eq!(
        extracted_description.technologies,
        Some(vec![
            Some("java".to_string()),
            Some("react".to_string()),
            Some("spring".to_string()),
            Some("postgresql".to_string()),
            Some("docker".to_string()),
            Some("kubernetes".to_string())
        ])
    );
    assert_eq!(
        extracted_description.work_flexibility,
        Some("remote".to_string())
    )
}
