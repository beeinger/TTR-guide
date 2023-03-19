pub struct Config {
    pub reed_api_key: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv::dotenv().ok();

        let reed_api_key = std::env::var("REED_API_KEY").expect("REED_API_KEY must be set.");

        Self { reed_api_key }
    }
}
