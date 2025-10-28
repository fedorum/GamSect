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

// handler function for database requests (finding a theme, storing a theme)
async function handleDatabase(req, res) {
    try {
        switch (req.body.action) {
            // finds the requested theme in the database and returns it
            case 'findTheme':
                const theme = await prisma.theme.findUnique({
                    where: {
                        theme: req.body.theme
                    }
                });
                
                // if theme does not exist in database, return null
                if (theme == null) {
                    return res.status(200).send("Theme does not exist in database, will call Gemini instead");
                }
        
                // else, group of 4 comments are returned to be displayed
                const comments = await prisma.comment.findMany({
                    where: {
                        themeId: theme.id,
                        group: 1
                    }
                });
                return res.status(200).json(comments);
            
            // stores a theme and its related comments in the database
            case 'storeTheme':
                await prisma.theme.create({
                    data: {
                        theme: req.body.theme
                    }
                })

                // retrieves the theme's id as set by the database
                const storedTheme = await prisma.theme.findUnique({
                    where: {
                        theme: req.body.theme
                    }
                })
                const themeId = storedTheme.id;
                const commentsStored = req.body.comments;
                
                // assign the theme's id to each comment's entry to relate them
                await prisma.comment.createMany({
                    data: [
                        { group: 1, comment: commentsStored.comment1, author: commentsStored.author1, themeId: themeId },
                        { group: 1, comment: commentsStored.comment2, author: commentsStored.author2, themeId: themeId },
                        { group: 1, comment: commentsStored.comment3, author: commentsStored.author3, themeId: themeId },
                        { group: 1, comment: commentsStored.comment4, author: commentsStored.author4, themeId: themeId }
                    ]
                })
                return res.status(200).send("New theme and comments stored in database!");;
        }
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
}
