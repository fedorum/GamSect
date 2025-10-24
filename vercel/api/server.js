// VERCEL SERVER FOR GEMINI API CALLS

// importing modules to obtain the api key from the .env.local file
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// changing the file path of the dotenv config to the env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: path.join(__dirname, '../.env.local') });

// variables for the api key, model, and api endpoint (url) used in the call
const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-2.5-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
// console.log(url);

// req (request) and res (response) are object names that automatically communicate with the client
export default async function handler(req, res) {

    // only accepts requests with the "POST" method to prevent malicious requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // sending a request to the api when the frontend calls for it, and returning the response to the frontend
    try {
        console.log("Awaiting gemini response ...");

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        // receiving the prompts from gemini and sending it to the frontend
        const prompts = await response.json();
        res.status(200).json(prompts);
    }

    // catching the error when the request is not sent
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to call Gemini API" });
    }

};
