import axios from "axios";
import { GeminiAI } from "../lib/endpoints/GeminiEndpoint.js";

jest.mock("axios");

describe("ChatGeminiAi", () => {
    describe("generateResponse", () => {
        test("should generate response from Gemini AI", async () => {
            const mockResponse = [
                {
                    message: {
                        content: "Test response",
                    },
                },
            ];

            axios.post = jest.fn().mockResolvedValueOnce({ data: { choices: mockResponse } });
            const chatGeminiAI = new GeminiAI({ apiKey: "test_api_key" });
            const response = await chatGeminiAI.chat({ prompt: "test prompt" });
            expect(response).toEqual("Test response");
        });
    });

    describe("generateEmbeddings", () => {
        test("should generate embeddings from Gemini AI", async () => {
            const mockResponse = { embeddings: "Test embeddings" };
            axios.post = jest.fn().mockResolvedValue({ data: { data: { choices: mockResponse } } });
            const chatGeminiAI = new GeminiAI({ apiKey: "test_api_key" });
            const res = await chatGeminiAI.generateEmbeddings("test prompt");
            expect(res.choices.embeddings).toEqual("Test embeddings");
        });
    });

    describe("chatWithAI", () => {
        test("should chat with AI using multiple messages", async () => {
            const mockResponse = [
                {
                    message: {
                        content: "Test response 1",
                    },
                },
                {
                    message: {
                        content: "Test response 2",
                    },
                },
            ];
            axios.post = jest.fn().mockResolvedValueOnce({ data: { choices: mockResponse } });
            const chatGeminiAI = new GeminiAI({ apiKey: "test_api_key" });
            const chatMessages = [
                {
                    role: "user",
                    content: "message 1",
                },
                {
                    role: "agent",
                    content: "message 2",
                },
            ];
            //@ts-ignore
            const responses = await chatGeminiAI.chat({ messages: chatMessages });
            expect(responses).toEqual(mockResponse);
        });
    });

    describe("testResponseGeneration", () => {
        test("should generate test response from Gemini AI", async () => {
            const mockResponse = [
                {
                    message: {
                        content: "Test response",
                    },
                },
            ];
            axios.post = jest.fn().mockResolvedValueOnce({ data: { choices: mockResponse } });
            const chatGeminiAI = new GeminiAI({ apiKey: "test_api_key" });
            const response = await chatGeminiAI.chat({ prompt: "test prompt" });
            expect(response).toEqual("Test response");
        });
    });
});
