const mongoose = require("mongoose");

const ResumeAnalysisSchema = new mongoose.Schema({
  resumeText: String,
  jobDescription: String,
  score: Number,
  matchedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);