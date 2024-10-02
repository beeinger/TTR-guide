import * as fs from "fs";
import { JobPost } from "./types";
import { getJobDetails, getJobPosts } from "./utils";

const main = async () => {
  const data = await getJobPosts();

  let alreadyGot = 100;
  const total = alreadyGot * 20;

  console.log("Total results: " + total);

  const requests = [];
  while (alreadyGot < total) requests.push((alreadyGot += 100));

  const jobs = await (
    await Promise.all(requests.map((skip) => getJobPosts(skip)))
  ).reduce<JobPost[]>(
    (acc, val) => [...acc, ...val.results],
    [...data.results]
  );

  console.log("Got ", data.results.length, " job posts");

  const detailedJobs = await Promise.all(
    jobs.slice(0, 2000 - 20).map((jobPost) => getJobDetails(jobPost.jobId))
  );

  console.log("Got " + detailedJobs.length, " job posts with details");

  fs.writeFile("db.json", JSON.stringify(detailedJobs), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

main();
