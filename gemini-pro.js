import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async code allows other code to run while it is being processed - ensures more responsive application, less UI freezing
async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = "Generate 5 prompts based on the theme of Revenge";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const prompts = response.text();
    console.log(prompts);
}

console.log();
console.log(process.env.GEMINI_API_KEY);