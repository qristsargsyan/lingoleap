
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Language, Exercise, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const createChatSession = (language: Language, userName: string): Chat => {
    return ai.chats.create({
        model,
        config: {
            systemInstruction: `You are Lingo, a friendly, patient, and encouraging AI language tutor. You are teaching ${language.name} to a student named ${userName}. Keep your explanations clear, concise, and engaging. Use emojis to make learning fun. Start the conversation by warmly greeting ${userName} in ${language.name} and then in English.`,
        },
    });
};

export const generateStudyMaterial = async (language: Language, topic: string, level: string): Promise<string> => {
    try {
        const prompt = `Generate a study guide for a ${level} learner of ${language.name} on the topic of "${topic}".
        The guide should be well-structured.
        Include:
        1. A clear explanation of the concept.
        2. Key vocabulary with translations.
        3. Several example sentences demonstrating usage.
        4. A short, encouraging summary.
        Format the output using markdown-style headers, lists, and bold text for clarity.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating study material:", error);
        return "Sorry, I couldn't generate the study material at this moment. Please try again later.";
    }
};

export const generateGrammarGuide = async (language: Language, topic: string, level: string): Promise<string> => {
    try {
        const prompt = `Generate a detailed grammar guide for a ${level} learner of ${language.name} on the topic of "${topic}".
        The guide must be easy to understand and well-structured.
        Include:
        1. A clear explanation of the grammar rule(s).
        2. Several example sentences showing correct usage, with translations to English.
        3. Common mistakes or pitfalls to avoid.
        4. A short summary with key takeaways.
        Format the output using markdown-style headers, lists, and bold text for clarity.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating grammar guide:", error);
        return "Sorry, I couldn't generate the grammar guide at this moment. Please try again later.";
    }
};

const exerciseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, enum: ['fill-in-the-blank', 'multiple-choice', 'translation'] },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
            answer: { type: Type.STRING },
        },
        required: ['type', 'question', 'answer']
    }
};

export const generateExercises = async (language: Language, topic: string, level: string): Promise<Exercise[]> => {
    try {
        const prompt = `Generate 5 diverse exercises for a ${level} learner of ${language.name} on the topic: "${topic}". Include a mix of fill-in-the-blank, multiple choice, and translation exercises. For fill-in-the-blank, use "___" for the blank.`;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: exerciseSchema
            }
        });

        const jsonStr = response.text.trim();
        const exercises = JSON.parse(jsonStr) as Exercise[];
        return exercises;
    } catch (error) {
        console.error("Error generating exercises:", error);
        throw new Error("Failed to generate exercises. The AI might be having a busy day!");
    }
};

const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
            correctAnswer: { type: Type.STRING },
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

export const generateQuiz = async (language: Language, level: string): Promise<QuizQuestion[]> => {
    try {
        const prompt = `Create a 10-question multiple-choice quiz for a ${level} learner of ${language.name}. The questions should cover a mix of vocabulary, grammar, and basic cultural knowledge. Each question must have 4 options. One of the options must be the correct answer.`;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: quizSchema,
            }
        });
        const jsonStr = response.text.trim();
        const quiz = JSON.parse(jsonStr) as QuizQuestion[];
        // Ensure the correct answer is one of the options
        return quiz.filter(q => q.options.includes(q.correctAnswer));
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate a quiz. Let's try again in a moment.");
    }
};