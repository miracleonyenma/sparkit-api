import mongoose, { Schema, Document } from "mongoose";

interface ISparkCategory extends Document {
  name: string;
  description?: string;
}

const SparkCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

const SparkCategory = mongoose.model<ISparkCategory>(
  "SparkCategory",
  SparkCategorySchema
);

export default SparkCategory;
