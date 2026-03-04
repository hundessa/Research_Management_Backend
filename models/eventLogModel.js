import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema({
  actor: {          
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {         
    type: String,
    required: true,
  },
  target: {          
    type: mongoose.Schema.Types.ObjectId,
    ref: "Research",
    required: true,
  },
  previousState: {   
    type: String,
  },
  newState: {       
    type: String,
  },
  metadata: {       
    type: mongoose.Schema.Types.Mixed,
  },
  timestamp: {       
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("EventLog", eventLogSchema);