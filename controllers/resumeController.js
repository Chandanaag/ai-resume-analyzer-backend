const parsePDF = require("../utils/pdfParser");
const { analyzeWithAI, rewriteWithAI } = require("../services/aiService");
const ResumeAnalysis = require("../models/ResumeAnalysis");

exports.analyzeResume = async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    const filePath = req.file.path;

    // Extract resume text
    const resumeText = await parsePDF(filePath);

    // AI analysis
    const aiResult = await analyzeWithAI(resumeText, jobDescription);

    // const parsed = JSON.parse(aiResult);
    let cleanResult = aiResult
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanResult);
    // Save in DB
    const result = await ResumeAnalysis.create({
      resumeText,
      jobDescription,
      score: parsed.score,
      matchedSkills: parsed.matchedSkills,
      missingSkills: parsed.missingSkills,
      suggestions: parsed.suggestions,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
};

exports.rewriteResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    const aiResult = await rewriteWithAI(resumeText);

    res.json({ improvedResume: aiResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Rewrite failed" });
  }
};
