import mongoose from "mongoose"

const RequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    area: String, // Selected area
    details: Object, // Details of the request
    matchedAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agent" }], // Matched agents
    createdAt: { type: Date, default: Date.now },
  });
  
export const Request = mongoose.model("Request", RequestSchema);