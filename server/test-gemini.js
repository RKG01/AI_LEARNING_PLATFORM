require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log('Testing Gemini API...');
        console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

        // Try to list models
        try {
            const models = await genAI.listModels();
            console.log('Available models:');
            models.forEach(model => {
                console.log(`- ${model.name} (${model.displayName})`);
            });
        } catch (error) {
            console.log('Could not list models:', error.message);
        }

        // Test different model names
        const modelNames = [
            'gemini-1.5-flash',
            'models/gemini-1.5-flash',
            'gemini-1.5-pro',
            'models/gemini-1.5-pro',
            'gemini-pro',
            'models/gemini-pro'
        ];

        for (const modelName of modelNames) {
            try {
                console.log(`\nTesting model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello, world!');
                const response = await result.response;
                const text = response.text();
                console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}...`);
                break;
            } catch (error) {
                console.log(`❌ ${modelName} failed: ${error.message}`);
            }
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testGemini();