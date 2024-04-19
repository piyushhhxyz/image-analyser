const fs = require('fs');
const OpenAI = require('openai');
const { Stream } = require('stream');
require('dotenv').config();

const openai = new OpenAI();
let mistral7B = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  });

async function gpt4V_vision(question, imagePath) {
    const visionPrompt = process.env.vision_prompt;
    const base64Image = fs.readFileSync(imagePath, 'base64')
    const b64ImageContent =  
        { type: 'image_url', image_url: `data:image/jpeg;base64,${base64Image}`};

    const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
            { role: 'system',content: visionPrompt },
            {
                role: 'user',
                content: [
                    { type: 'text', text: question },
                    b64ImageContent,
                ]
            },
        ],
        max_tokens: 300,
    });
    return response.choices[0].message.content;
}

async function analyzeAndRate(description) {
    const ratingCommand = process.env.rating_command;   
            const messages = [
                { "role": "system", "content": ratingCommand, },
                { "role": "user","content": description },
            ]
            const completion = await mistral7B.chat.completions.create({
                messages,
                model: "mixtral-8x7b-32768",
            });
            console.log(completion.choices[0].message.content);
}

(async () => {
    const description = await gpt4V_vision('washroom image:', 'data/bvcoe_wc/1.jpeg');
    await analyzeAndRate(description);
})();