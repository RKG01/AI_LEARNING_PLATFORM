const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generateSummary(content) {
        try {
            const prompt = `
        Please analyze the following text and create a comprehensive topic-wise summary. 
        
        Instructions:
        1. First provide an overall summary paragraph
        2. Then break down the content into key topics with detailed explanations
        3. Make it educational and easy to understand
        4. Use clear headings and well-structured content
        
        Format the response as JSON with this exact structure:
        {
          "summary": "Write a comprehensive overall summary paragraph here",
          "topics": [
            {
              "title": "Topic Title",
              "content": "Detailed explanation of this topic with key points and examples"
            }
          ]
        }
        
        Text to analyze:
        ${content}
      `;

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Clean the response text (remove markdown code blocks if present)
            let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // Try to parse JSON, fallback to structured text if parsing fails
            try {
                const parsed = JSON.parse(cleanText);
                return parsed;
            } catch (parseError) {
                console.log('JSON parsing failed, creating structured response');
                return {
                    summary: text,
                    topics: [{ title: "Main Content", content: text }]
                };
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            throw new Error('Failed to generate summary');
        }
    }

    async generateFlashcards(content) {
        try {
            const prompt = `
        Create comprehensive flashcards from the following content. 
        
        Instructions:
        1. Analyze the content and determine the optimal number of flashcards (15-25 cards)
        2. Create questions that test understanding, not just memorization
        3. Include different types: definitions, concepts, examples, applications
        4. Make answers clear and educational
        5. Cover all important topics from the content
        
        Format as JSON array:
        [
          {
            "question": "Clear, specific question",
            "answer": "Comprehensive answer with explanation"
          }
        ]
        
        Content:
        ${content}
      `;

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Clean the response text
            let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            try {
                const parsed = JSON.parse(cleanText);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (parseError) {
                console.log('JSON parsing failed for flashcards, creating fallback');
                // Fallback: create basic flashcards
                return [
                    {
                        question: "What is the main topic of this content?",
                        answer: content.substring(0, 300) + "..."
                    },
                    {
                        question: "What are the key concepts discussed?",
                        answer: "The content covers various important topics that require further study."
                    }
                ];
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
            throw new Error('Failed to generate flashcards');
        }
    }

    async generateContent(prompt) {
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Clean the response text
            let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            return cleanText;
        } catch (error) {
            console.error('Error generating content:', error);
            throw new Error('Failed to generate content');
        }
    }

  async generateQuiz(content, numQuestions = 20) {
        try {
            const prompt = `
        Create ${numQuestions} high-quality multiple-choice questions from the following content.
        
        Instructions:
        1. Create exactly ${numQuestions} questions
        2. Questions should test understanding, analysis, and application
        3. Include different difficulty levels (easy, medium, hard)
        4. Make sure all 4 options are plausible
        5. Avoid obvious wrong answers
        6. Cover different aspects of the content
        
        Format as JSON array:
        [
          {
            "question": "Clear, specific question",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": 0
          }
        ]
        
        Content:
        ${content}
      `;

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Clean the response text
            let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            try {
                const parsed = JSON.parse(cleanText);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (parseError) {
                console.log('JSON parsing failed for quiz, creating fallback');
                // Fallback: create basic quiz
                const fallbackQuestions = [];
                for (let i = 0; i < Math.min(numQuestions, 5); i++) {
                    fallbackQuestions.push({
                        question: `Question ${i + 1}: What is discussed in this content?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: 0
                    });
                }
                return fallbackQuestions;
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            throw new Error('Failed to generate quiz');
        }
    }
}

module.exports = new GeminiService();