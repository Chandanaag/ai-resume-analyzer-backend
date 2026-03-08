// const axios = require("axios");

// const analyzeWithAI = async (resumeText, jobDescription) => {
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: `
// Compare this resume with the job description.

// Return JSON:

// {
// score: number,
// matchedSkills: [],
// missingSkills: [],
// suggestions: []
// }

// Resume:
// ${resumeText}

// Job Description:
// ${jobDescription}
// `,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     return response.data.choices[0].message.content;
//   } catch (err) {
//     if (err.response?.status === 429) {
//       throw new Error("AI rate limit exceeded. Try again in a few seconds.");
//     }
//     throw err;
//   }
// };

// module.exports = analyzeWithAI;

const axios = require("axios");

const analyzeWithAI = async (resumeText, jobDescription) => {
  try {
    // Limit resume size to avoid token overflow
    const truncatedResume = resumeText.slice(0, 2000);

    const prompt = `
You are an ATS resume analyzer.

Compare the resume with the job description.

Return ONLY JSON in this format:

{
  "score": number,
  "matchedSkills": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:
${truncatedResume}

Job Description:
${jobDescription}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an ATS resume analyzer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);

    throw new Error("AI analysis failed");
  }
};
const rewriteWithAI = async (resumeText) => {
  const prompt = `
Improve the following resume bullet points to be more professional.

Use strong action verbs and measurable impact.

Resume:
${resumeText}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a resume expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0].message.content;
};

module.exports = { analyzeWithAI, rewriteWithAI };
// module.exports = analyzeWithAI;
