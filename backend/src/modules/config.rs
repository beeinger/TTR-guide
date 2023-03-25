pub fn get_reed_api_key() -> String {
    dotenv::dotenv().ok();
    std::env::var("REED_API_KEY").expect("REED_API_KEY must be set.")
}

pub fn get_table_name() -> String {
    dotenv::dotenv().ok();
    std::env::var("TABLE_NAME").expect("TABLE_NAME must be set.")
}

pub fn get_gpt_api_key() -> String {
    dotenv::dotenv().ok();
    std::env::var("GPT_API_KEY").expect("GPT_API_KEY must be set.")
}
