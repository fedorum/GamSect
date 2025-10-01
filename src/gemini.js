// EXPRESS SERVER FOR GEMINI API CALLS

// importing modules to obtain the api key from the .env.local file
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// changing the file path of the dotenv config to the env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: path.join(__dirname, '../.env.local') });

// initialising the url for the gemini api call
const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-2.5-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
console.log(url);

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// req (request) and res (response) are object names that automatically communicate with the client
app.post("gemini", async (req, res) => {
    // sending a request to the api when the frontend calls for it, and returning the response to the frontend
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const prompts = await response.json();
        res.json(prompts);
    }
    // catching the error when the request is not sent
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to call Gemini API" });
    }
});

const port = 3000;
// 
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
