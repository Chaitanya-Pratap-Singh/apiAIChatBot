import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(bodyParser.json());
app.use(express.static('public'));

async function LLM_Response(question) {
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([question]);
    return result.response.text();  
}

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const answer = await LLM_Response(question);
        res.json({ answer });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ answer: 'An error occurred. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
