// BACKEND SERVER TO HANDLE GEMINI API AND PRISMA POSTGRES DATABASE CALLS

// main function to handle requests from index.js
export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            if (req.body.type === "database") {
                return handleDatabase(req, res);
            }
            else {
                return handleGemini(req, res);
            }
        default:
            return res.status(405).json({ error: "Method not allowed" });
    }
}

// PRISMA POSTGRES DATABASE CALLS

// importing the prisma client to use its commands to access the database
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 
async function handleDatabase(req, res) {
    try {
        // SOMETHING WRONG WITH CASE?
        // console.log(req.body);
        // const action = req.body;
    
        // switch (action) {
        //     case 'getThemes':
        //         console.log("getThemes hit!");
        //         const themes = await prisma.themes.findMany();
        //         console.log(themes);
        //         return res.status(200).json(themes);
        //     // case for saving comments to specific theme
        // }

        const themes = await prisma.themes.findMany();
        return res.status(200).json(themes);
    }

    catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database operation failed" });
    }
}

// GEMINI API CALLS

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

// req (request) and res (response) are object names that automatically communicate with the client
async function handleGemini(req, res) {
    console.log("handleGemini hit!");
    try {
        console.log("Awaiting gemini response ...");
        // sending a request to the api when the frontend calls for it and returning the response to the frontend
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        // receiving the prompts from gemini and sending it to the frontend
        const prompts = await response.json();
        return res.status(200).json(prompts);
    }

    // catching the error when the request is not sent
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to call Gemini API" });
    }

};
