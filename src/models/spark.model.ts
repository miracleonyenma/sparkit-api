import mongoose, { Schema, model, Document } from "mongoose";

interface Spark extends Document {
  title: string;
  contentUrl: string;
  fileType: "image" | "video" | "pdf" | "markdown";
  description: string;
  category: Schema.Types.ObjectId; // Reference to SparkCategory
  createdAt: Date;
  creator: Schema.Types.ObjectId; // Reference to Creator
  launchDate: Date;
  subscribers: Schema.Types.ObjectId[]; // List of Subscribers
  isLaunched: boolean; // Indicates if the spark has been launched
  teasers: Schema.Types.ObjectId[]; // List of teasers for this spark
}

const SparkSchema = new Schema<Spark>({
  title: { type: String, required: true },
  contentUrl: { type: String, required: true },
  fileType: {
    type: String,
    enum: ["image", "video", "pdf", "markdown"],
    required: true,
  },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "SparkCategory" },
  createdAt: { type: Date, default: Date.now },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  launchDate: { type: Date, required: true },
  subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isLaunched: { type: Boolean, default: false },
  teasers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teaser", // Reference to teasers for this spark
    },
  ],
});

const Spark = mongoose.model<Spark>("Spark", SparkSchema);

export default Spark;
