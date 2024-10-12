// ./src/jobs/sendTeaserCron.ts
import cron from "node-cron";
import { sendTeasers } from "../services/teaser.services.js";

// Schedule this job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Checking for teasers to send...");
  await sendTeasers();
});
