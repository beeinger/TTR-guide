pub struct Config {
    pub reed_api_key: String,
    pub table_name: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv::dotenv().ok();

        let reed_api_key = std::env::var("REED_API_KEY").expect("REED_API_KEY must be set.");
        let table_name = std::env::var("TABLE_NAME").expect("TABLE_NAME must be set.");

        Self {
            reed_api_key,
            table_name,
        }
    }
}
