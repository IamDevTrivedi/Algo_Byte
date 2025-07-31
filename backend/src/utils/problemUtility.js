
const axios = require('axios');
require('dotenv').config();

const base64Encode = (text) => Buffer.from(text).toString('base64');


const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
  };
  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  try {
    // const url = "https://judge0-ce.p.rapidapi.com/submissions/batch";
    const url = "https://judge0-ce.p.rapidapi.com/submissions/batch";

    const encodedSubmissions = submissions.map(sub => ({
      source_code: sub.source_code,
      language_id: sub.language_id,
      stdin: sub.stdin,
      expected_output: sub.expected_output
    }));

    const response = await axios.post(
      url,
      { submissions: encodedSubmissions },
      {
        params: { base64_encoded: false },
        headers: {
          "x-rapidapi-key": process.env.JUDGE0_API_KEY,
          "x-rapidapi-host": process.env.JUDGE0_HOST,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("🚀 Judge0 submission response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" submitBatch error:", error.response?.data || error.message);
    throw error;
  }
};

const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_API_KEY,
      'x-rapidapi-host': process.env.JUDGE0_HOST
    }
  };
  console.log("kergfuufu3ufugfuigufig3iufg3ug3u3u")
  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(" submitToken error:", error.response?.data || error.message);
    }
  };

  while (true) {
    const result = await fetchData();
    console.log("kergfuufu3ufugfuigufig3iufg3ug3u3u")
    if (!result?.submissions) continue;

    const done = result.submissions.every(r => r.status_id > 2);
    console.log(result)
    if (done) return result.submissions;

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

module.exports = { getLanguageById, submitBatch, submitToken, base64Encode };
