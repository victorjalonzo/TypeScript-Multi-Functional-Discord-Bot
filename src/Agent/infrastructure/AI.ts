import { Config } from "../../shared/config/config.js";

export class AI {
    static createCompletion = async (prompt: string): Promise<string> => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${Config.googleGenerativeAI.apiKey}`

        const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"contents":[{"parts":[{"text":prompt}]}]}),
        });
    
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text

        return text
    }
}