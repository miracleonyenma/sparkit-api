// ./src/services/spark.services.ts

import { generateEmailTemplate, mailSender } from "../utils/mail.js";
import { config } from "dotenv";
config();

/**
 * Send an email when a user subscribes to a spark.
 */
const sendSparkSubscriptionMail = async (email: string, sparkTitle: string) => {
  const content = `
    <p>Congratulations!</p>
    <p>You have successfully subscribed to the spark: <strong>${sparkTitle}</strong>.</p>
    <p>Stay tuned for teasers and updates!</p>
  `;

  const emailBody = generateEmailTemplate(
    "Spark Subscription Confirmation",
    content
  );

  try {
    const mailResponse = await mailSender(
      email,
      "Subscription Confirmation",
      emailBody
    );
    return mailResponse;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Send an email when a user unsubscribes from a spark.
 */
const sendSparkUnsubscriptionMail = async (
  email: string,
  sparkTitle: string
) => {
  const content = `
    <p>You've successfully unsubscribed from the spark: <strong>${sparkTitle}</strong>.</p>
    <p>We're sorry to see you go! If you change your mind, you can always resubscribe.</p>
    <p>Stay tuned for other exciting sparks in the future!</p>
  `;

  const emailBody = generateEmailTemplate(
    "Spark Unsubscription Confirmation",
    content
  );

  try {
    const mailResponse = await mailSender(
      email,
      "Unsubscribed from Spark",
      emailBody
    );
    return mailResponse;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Send a teaser email to subscribers before a spark is launched.
 */
const sendSparkTeaserMail = async (
  email: string,
  sparkTitle: string,
  teaserText: string
) => {
  const content = `
    <p>Exciting News!</p>
    <p>A teaser for the spark <strong>${sparkTitle}</strong> has just been released.</p>
    <p>${teaserText}</p>
    <p>Stay tuned for the full launch soon!</p>
  `;

  const emailBody = generateEmailTemplate("Spark Teaser", content);

  try {
    const mailResponse = await mailSender(
      email,
      "New Teaser for Spark",
      emailBody
    );
    return mailResponse;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Send an email when the spark is officially launched.
 */
const sendSparkIgnitionMail = async (
  email: string,
  sparkTitle: string,
  sparkLink: string
) => {
  const content = `
    <p>The wait is over!</p>
    <p>The spark <strong>${sparkTitle}</strong> has been officially launched.</p>
    <p>You can now view the spark here: <a href="${sparkLink}">${sparkLink}</a>.</p>
    <p>Enjoy the content and stay engaged!</p>
  `;

  const emailBody = generateEmailTemplate("Spark Ignition", content);

  try {
    const mailResponse = await mailSender(email, "Spark Launched!", emailBody);
    return mailResponse;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Send an email when the AI-assisted story is completed for a spark.
 */
const sendStoryCompletionMail = async (email: string, sparkTitle: string) => {
  const content = `
    <p>Exciting Update!</p>
    <p>The AI-assisted story for your spark <strong>${sparkTitle}</strong> has been completed.</p>
    <p>It's now ready for you to review and share with your subscribers!</p>
  `;

  const emailBody = generateEmailTemplate("Spark Story Completed", content);

  try {
    const mailResponse = await mailSender(
      email,
      "Spark Story Completed",
      emailBody
    );
    return mailResponse;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  sendSparkSubscriptionMail,
  sendSparkUnsubscriptionMail,
  sendSparkTeaserMail,
  sendSparkIgnitionMail,
  sendStoryCompletionMail,
};
