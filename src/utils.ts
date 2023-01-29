import axios from "axios";
import { JobPost, JobPostWithDetails } from "./types";

export const API_KEY = "8dc12dda-72e6-4524-a915-2cd48f9d0ee2";

export const MAX_RESULTS_PER_PAGE = 100;

export const getJobPosts = async (
  skip?: number
): Promise<{
  results: JobPost[];
  totalResults: number;
}> => {
  const result = await axios.get(
    `https://www.reed.co.uk/api/1.0/search?resultsToTake=${MAX_RESULTS_PER_PAGE}&resultsToSkip=${
      skip || 0
    }`,
    {
      auth: {
        username: API_KEY,
        password: "",
      },
    }
  );
  console.log("Got a batch of jobs " + (skip ? skip / 100 : 0));

  return result.data;
};

export const getJobDetails = async (
  jobId: JobPost["jobId"]
): Promise<JobPostWithDetails> => {
  const result = await axios.get(
    `https://www.reed.co.uk/api/1.0/jobs/${jobId}`,
    {
      auth: {
        username: API_KEY,
        password: "",
      },
    }
  );
  console.log("Got some details for job " + jobId);

  return result.data;
};
