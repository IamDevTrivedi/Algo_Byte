const { GoogleGenAI } = require("@google/genai");

const replyByLLM = async (req, res) => {
  try {
    const {
      messages,
      title,
      description,
      testCases,
      startCode,
      displayMsg,
    } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems.

## RESPONSE FORMAT REQUIREMENTS:
You MUST follow the response format below strictly.

---

🧠 **Thoughts**:

You must think step-by-step in depth before jumping to the final answer.

Explain your reasoning in **at least 5–7 detailed bullet points**, covering:

- A clear restatement of the problem.
- Constraints or special conditions.
- Edge cases or tricky scenarios.
- High-level algorithm choices (brute force vs optimized).
- Why a certain approach is better (trade-offs).
- Dry-run a small example with that approach.
- Transition into what the code will do.

Do NOT write code here — only human-style planning and logic.


When providing code examples, ALWAYS wrap them in triple backticks with language specification:
\`\`\`javascript
// Your code here
\`\`\`

For explanations, use regular text. You can mix text and code blocks in your response.

Example response format:
Here's how you can solve this problem:

First, let's understand the approach:
- Step 1: Initialize variables
- Step 2: Iterate through the array

\`\`\`javascript
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
}
\`\`\`

The time complexity is O(n) because we iterate through the array once.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${testCases}
[startCode]: ${startCode}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches
6. **Test Case Helper**: Help create additional test cases

## RULES (Follow strictly):

- NEVER skip the 🧠 Thoughts section.
- Your 🧠 Thoughts section must include **at least 5 detailed bullet points**. If you cannot reach 5, you're not thinking enough.
- 
- whatever you thought, put in thought section then answer the question
- thought on every user question.
- Thought more then answer
- NEVER include code in the Thoughts section.
- ALWAYS wrap code blocks in triple backticks with correct language 
- Do NOT include unrelated information.
- ONLY solve the problem described in the current context.

## STRICT LIMITATIONS:
- If thought section has fewer than 5 points, REGENERATE the response
- Each thought point must be at least one full sentence
- No trivial or repetitive thoughts
- ONLY discuss topics related to  DSA problem
- DO NOT help with non-DSA topics
- If asked about unrelated topics, politely redirect to the current problem

Remember: Always format code in triple backticks for proper display.
`
                },
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: -1
        },
      },
    );

    let thoughts = "";
    let answer = "";

    for await (const chunk of responseStream) {
      const parts = chunk?.candidates?.[0]?.content?.parts || [];

      for (const part of parts) {
       
        if (part.thought) {
          thoughts += part.text || "";
        } else {
          answer += part.text || "";
        }
       
      }
    }
    // Split the answer into code and text parts
    const parts = parseResponseIntoParts(answer);
    
    
    res.status(201).json({
      message: parts,
      thoughts: thoughts.trim(), // Include CoT for frontend display
    });
  } catch (err) {
    console.error("Gemini error", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Helper function (no changes needed)
function parseResponseIntoParts(responseText) {
  const parts = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(responseText)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = responseText.slice(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push({ text: textBefore });
      }
    }

    const language = match[1] || "javascript";
    const codeContent = match[2].trim();
    parts.push({
      aiCode: codeContent,
      language,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < responseText.length) {
    const remainingText = responseText.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({ text: remainingText });
    }
  }

  return parts.length > 0 ? parts : [{ text: responseText }];
}

module.exports = replyByLLM;

