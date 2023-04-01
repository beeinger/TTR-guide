pub fn get_reed_api_key() -> String {
    dotenv::dotenv().ok();
    std::env::var("REED_API_KEY").expect("REED_API_KEY must be set.")
}

pub fn get_job_posts_table_name() -> String {
    dotenv::dotenv().ok();
    std::env::var("JOB_POSTS_TABLE_NAME").expect("JOB_POSTS_TABLE_NAME must be set.")
}

pub fn get_statistics_table_name() -> String {
    dotenv::dotenv().ok();
    std::env::var("STATISTICS_TABLE_NAME").expect("STATISTICS_TABLE_NAME must be set.")
}

pub fn get_gpt_api_key() -> String {
    dotenv::dotenv().ok();
    std::env::var("GPT_API_KEY").expect("GPT_API_KEY must be set.")
}

pub fn get_process_job_queue_url() -> String {
    dotenv::dotenv().ok();
    std::env::var("JOB_POSTS_QUEUE_URL").expect("PROCESS_JOB_QUEUE_URL must be set.")
}

pub fn get_generate_statistics_queue_url() -> String {
    dotenv::dotenv().ok();
    std::env::var("GENERATE_STATISTICS_QUEUE_URL")
        .expect("GENERATE_STATISTICS_QUEUE_URL must be set.")
}
