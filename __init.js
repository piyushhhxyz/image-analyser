const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const openai = new OpenAI();

async function gpt4V_vision(question, imageFolder) {
    const visionPrompt = `Describe the given washroom/toilet image, specifically talking about amenities and cleanliness in great detail. Focus on sanitation and how well maintained the washroom is.`;
    
    // Get the list of image files from the specified folder
    const imageFiles = fs.readdirSync(imageFolder);

    // Loop through each image file
    for (const imageFile of imageFiles) {
        const imagePath = path.join(imageFolder, imageFile);
        const base64Image = fs.readFileSync(imagePath, 'base64');
        const b64ImageContent = { type: 'image_url', image_url: `data:image/jpeg;base64,${base64Image}` };

        const response = await openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
                { role: 'system', content: visionPrompt },
                { role: 'user', content: [{ type: 'text', text: question }, b64ImageContent] },
            ],
            max_tokens: 300,
        });
        console.log('GPT:', response.choices[0].message.content);
    }
}

async function analyzeAndRate(description) {
    const ratingCommand = `You are rating this washroom/toilet on a scale of 1 to 100, based on the provided description. Just give a rating and a one-line reason.`;
    const messages = [
        { "role": "system", "content": ratingCommand },
        { "role": "user", "content": description },
    ];

    const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
    });
    console.log(completion.choices[0].message.content);
}

// Specify the question and the folder containing the images
const question = 'Given this washroom image, what do you think about its cleanliness and amenities?';
const imageFolder = 'data/bvcoe:wc/1';

// Call the function to analyze and rate each image in the folder
gpt4V_vision(question, imageFolder);

// Example description to analyze and rate
// const testDescript?ion = `The washroom in the image appears to be equipped with three wall-mounted urinals... (your description here)`;
// analyzeAndRate(testDescription);
