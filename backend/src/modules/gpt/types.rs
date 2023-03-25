use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct ExtractedDescription {
    pub position: Option<String>,
    pub technologies: Option<Vec<Option<String>>>,
    pub work_flexibility: Option<String>,
}
