#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Welcome to Personalized Learning Platform Setup!\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function setup() {
    try {
        console.log('Let\'s configure your environment variables...\n');

        // Backend configuration
        console.log('📊 Backend Configuration:');
        const mongoUri = await askQuestion('MongoDB URI (default: mongodb://localhost:27017/learning-platform): ');
        const geminiKey = await askQuestion('Google Gemini API Key (required): ');
        const port = await askQuestion('Server Port (default: 5000): ');

        // Frontend configuration
        console.log('\n🎨 Frontend Configuration:');
        const apiUrl = await askQuestion('Backend API URL (default: http://localhost:5000/api): ');

        // Create backend .env file
        const backendEnv = `PORT=${port || '5000'}
MONGODB_URI=${mongoUri || 'mongodb://localhost:27017/learning-platform'}
GEMINI_API_KEY=${geminiKey}`;

        fs.writeFileSync(path.join(__dirname, 'server', '.env'), backendEnv);
        console.log('✅ Backend .env file created');

        // Create frontend .env file
        const frontendEnv = `REACT_APP_API_URL=${apiUrl || 'http://localhost:5000/api'}`;

        fs.writeFileSync(path.join(__dirname, 'client', '.env'), frontendEnv);
        console.log('✅ Frontend .env file created');

        console.log('\n🎉 Setup complete! Next steps:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Run "npm run install-all" to install dependencies');
        console.log('3. Run "npm run dev" to start both servers');
        console.log('\n📚 Happy learning!');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

setup();