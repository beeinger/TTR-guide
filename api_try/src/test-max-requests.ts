import { getJobDetails, getJobPosts, MAX_RESULTS_PER_PAGE } from "./utils";

const maxJobDetails = async () => {
  let jobId = 49561749;
  let getJobPostsCounter = 0;

  try {
    for (let i = 0; i < jobId; i++) {
      await getJobDetails(jobId);
      jobId++;
      getJobPostsCounter++;
    }
  } catch (e) {}
  console.log("getJobPostsCounter", getJobPostsCounter);
};

const maxJobPosts = async () => {
  let skip = 0;
  let getJobDetailsCounter = 0;

  try {
    while (true) {
      await getJobPosts(skip);
      skip += MAX_RESULTS_PER_PAGE;
    }
  } catch (e) {}
  console.log("getJobDetailsCounter", getJobDetailsCounter);
};
