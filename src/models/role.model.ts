// ./src/models/role.model.ts

import mongoose, { Document, Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
