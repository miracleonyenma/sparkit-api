// ./src/jobs/sendTeaserJob.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import Spark from "../models/spark.model.js";
import Teaser from "../models/teaser.model.js";
import User from "../models/user.model.js";
import { sendSparkTeaserMail } from "../services/spark.services.js";
import SparkCategory from "../models/sparkCategory.model.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Call this function periodically with cron or another scheduler
const sendTeasers = async () => {
  const now = new Date();

  // Find teasers that are scheduled for now and haven't been sent
  const teasersToSend = await Teaser.find({
    scheduledDate: { $lte: now },
    sent: false,
  }).populate("spark");

  for (const teaser of teasersToSend) {
    // Get spark details and subscribers
    const spark = await Spark.findById(teaser.spark).populate("subscribers");

    // Send teaser email to each subscriber
    for (const subscriber of spark.subscribers) {
      const subscriberDocument = await User.findById(subscriber);
      await sendSparkTeaserMail(
        subscriberDocument.email,
        spark.title,
        teaser.content
      );
      console.log(
        `Sent teaser for spark ${spark.title} to ${subscriberDocument.email}`
      );
    }

    // Mark the teaser as sent
    teaser.sent = true;
    await teaser.save();
  }
};

const generateTeaserText = async (data: {
  sparkTitle: string;
  sparkDescription: string;
  sparkCategoryName: string;
  sparkCategoryDescription: string;
  style: string;
  description: string;
}) => {
  const defaultInstruction = `
    You are a highly creative and persuasive marketing copywriter specialized in crafting short, engaging teasers for creative works. 
    Your goal is to excite the audience and build anticipation for a spark, which is a creative work by a user. 
    - Focus on the key themes and emotions within the spark.
    - If a synopsis or description is provided, use it to craft the teaser.
    - If no synopsis is provided, create a teaser based on the spark's genre, category, and tags, making it relevant and engaging.
    - When a style or tone is specified, follow it closely (e.g., dramatic, humorous, inspirational).
    - Use short, punchy sentences, and leave the audience wanting more.
  `;

  // Create the prompt for the Gemini API
  let prompt = `Create a teaser for a spark titled "${data.sparkTitle}"`;

  if (data.description) {
    prompt += `, where the creator has provided the following description: "${data.description}".`;
    prompt += `, which is tagged as "${data.sparkCategoryName}" category.`;
  } else {
    prompt += ` No specific description has been provided.`;
  }

  if (data.style) {
    prompt += ` The style should be ${data.style}.`;
  } else {
    prompt += ` No specific style has been provided, so create something that fits the cetgory.`;
  }

  prompt += ` Make it engaging and leave the audience wanting more.`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: defaultInstruction,
    });

    const teaser = result.response.text();

    console.log("Generated teaser:", teaser);

    return teaser;
  } catch (error) {
    console.error("Error generating teaser:", error);
    throw error;
  }
};

const calculateTeaserInterval = (numTeasers: number = 2, launchDate: Date) => {
  const currentDate = new Date();
  const timeUntilLaunch = launchDate.getTime() - currentDate.getTime();
  const interval = timeUntilLaunch / numTeasers;

  const teaserDates = [];
  for (let i = 1; i <= numTeasers; i++) {
    teaserDates.push(new Date(currentDate.getTime() + i * interval));
  }

  return teaserDates;
};

const generateTeasers = async (
  sparkId: string,
  numTeasers: number,
  description: string,
  style: string
) => {
  const spark = await Spark.findById(sparkId);

  if (!spark) throw new Error("Spark not found");

  const sparkCategory = await SparkCategory.findById(spark.category);

  const teasers = [];
  const teaserInterval = calculateTeaserInterval(numTeasers, spark.launchDate); // Function to spread teasers over time

  for (let i = 0; i < numTeasers; i++) {
    const teaserText = await generateTeaserText({
      description: description || spark.description,
      sparkTitle: spark.title,
      sparkCategoryName: sparkCategory.name,
      sparkCategoryDescription: sparkCategory.description,
      sparkDescription: spark.description,
      style: style || "exciting",
    }); // Generate teaser content with AI
    // const teaserImage = await generateTeaserImage(description); // Optionally generate an image

    const teaser = new Teaser({
      spark: sparkId,
      content: teaserText,
      scheduledDate: teaserInterval[i],
      // imageUrl: teaserImage,
      sent: false,
    });

    teasers.push(teaser);
    await teaser.save(); // Save each teaser
  }

  return teasers;
};

export { sendTeasers, generateTeasers };
