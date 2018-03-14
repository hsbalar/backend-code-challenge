import mongoose, { Schema } from "mongoose";

const Neos = new Schema({
  reference: {
    type: String,
    trim: true,
    required: "Please provide neo reference id"
  },
  name: {
    type: String,
    trim: true,
    required: "Please provide name"    
  },
  speed: {
    type: Number,
    required: "Please provide speed"    
  },
  isHazardous: {
    type: Boolean
  },
  date: {
    type: Date
  }
});

export default mongoose.model("Neos", Neos);
