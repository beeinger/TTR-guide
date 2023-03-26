use crate::modules::reed_api::types::JobDetails;

#[derive(serde::Deserialize, serde::Serialize, Debug)]
pub struct ProcessJobMessage {
    pub job: JobDetails,
}
