// ./src/models/teaser.model.ts
import mongoose, { Schema } from "mongoose";

const teaserSchema = new mongoose.Schema(
  {
    content: {
      type: String, // Text, image URL, or any content for the teaser
      required: true,
    },
    spark: {
      type: Schema.Types.ObjectId,
      ref: "Spark", // Reference to the related Spark
      required: true,
    },
    scheduledDate: {
      type: Date, // When the teaser will be sent to subscribers
      required: true,
    },
    sent: {
      type: Boolean, // Whether the teaser has already been sent
      default: false,
    },
  },
  { timestamps: true }
);

const Teaser = mongoose.model("Teaser", teaserSchema);

export default Teaser;
