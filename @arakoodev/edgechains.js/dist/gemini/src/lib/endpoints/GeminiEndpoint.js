"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAI = void 0;
const axios_1 = __importDefault(require("axios"));
const zod_to_json_schema_1 = require("zod-to-json-schema");
const GeminiAI_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
[];
class GeminiAI {
    apiKey;
    PROJECT_ID;
    GOOGLE_AUTH_TOKEN;
    constructor(options) {
        this.apiKey = options.apiKey || process.env.GeminiAI_API_KEY || "";
        this.PROJECT_ID = options.PROJECT_ID || process.env.GeminiAI_API_KEY || "";
        this.GOOGLE_AUTH_TOKEN = options.GOOGLE_AUTH_TOKEN || process.env.GOOGLE_AUTH_TOKEN || "";
    }

    async chat(chatOptions) {
        const apiKey = this.apiKey;
        const baseUrl = GeminiAI_url;
        const completeUrl = `${baseUrl}?key=${apiKey}`;
        const response = await axios_1.default
            .post(
                completeUrl,
                {
                    contents: {
                        role: chatOptions.role || "user",
                        parts: {
                            text: chatOptions.prompt || chatOptions.messages
                        }
                    },
                    generation_config: {
                        temperature: chatOptions.temperature || 0.35,
                        max_output_tokens: chatOptions.max_tokens || 256,
                        response_mime_type: "application/json"
                    }
                },
                {
                    headers: {
                        "content-type": "application/json",
                    },
                }
            )
            .then(response => {
                return response.data.choices;
            })
            .catch(error => {
                if (error.response) {
                    console.log("Server responded with status code:", error.response.status);
                    console.log("Response data:", error.response.data);
                } else if (error.request) {
                    console.log("No response received:", error);
                } else {
                    console.log("Error creating request:", error.message);
                }
            });
        console.log(response)
        return response[0].message;
    }

    async chatWithFunction(chatOptions) {
        const apiKey = this.apiKey;
        const baseUrl = GeminiAI_url;
        const completeUrl = `${baseUrl}?key=${apiKey}`;
        const response = await axios_1.default
            .post(
                completeUrl,
                {
                    contents: {
                        role: chatOptions.role || "user",
                        parts: {
                            text: chatOptions.prompt || chatOptions.messages
                        }
                    },
                    generation_config: {
                        temperature: chatOptions.temperature || 0.35,
                        max_output_tokens: chatOptions.max_tokens || 256,
                        response_mime_type: "application/json"
                    },
                    tools: [{
                        functionDeclarations: chatOptions.functions
                    }]
                },
                {
                    headers: {
                        "content-type": "application/json",
                    },
                }
            )
            .then(response => {
                return response.data.choices;
            })
            .catch(error => {
                if (error.response) {
                    console.log("Server responded with status code:", error.response.status);
                    console.log("Response data:", error.response.data);
                } else if (error.request) {
                    console.log("No response received:", error);
                } else {
                    console.log("Error creating request:", error.message);
                }
            });
        console.log(response);
        return response[0].message;
    }

    async generateEmbeddings(resp) {
        const model = "text-embedding-004";
        const response = await axios_1.default
            .post(
                `https://us-central1-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/us-central1/publishers/google/models/${model}:predict`,
                {
                    instances: resp
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.GOOGLE_AUTH_TOKEN}`,
                        "content-type": "application/json",
                    },
                }
            )
            .then(response => {
                return response.data.data;
            })
            .catch(error => {
                if (error.response) {
                    console.log("Server responded with status code:", error.response.status);
                    console.log("Response data:", error.response.data);
                } else if (error.request) {
                    console.log("No response received:", error.request);
                } else {
                    console.log("Error creating request:", error.message);
                }
            });
        return response;
    }

    async zodSchemaResponse(chatOptions) {
        const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(chatOptions.schema, { $refStrategy: 'none' });
        const GeminiAIFunctionCallDefinition = {
            name: "generateSchema",
            description: "Generate a schema based on provided details.",
            parameters: jsonSchema,
        };
        const content = `
            You are a Schema generator that can generate answer based on given prompt and then return the response based on the give schema 
            Remembrer if any field like url or link is not available please create a dummy link based on the following prompt
            prompt: ${chatOptions.prompt || ""}
        `;
        const apiKey = this.apiKey;
        const baseUrl = GeminiAI_url;
        const completeUrl = `${baseUrl}?key=${apiKey}`;
        const response = await axios_1.default
            .post(
                completeUrl,
                {
                    contents: {
                        role: chatOptions.role || "user",
                        parts: {
                            text: content
                        }
                    },
                    generation_config: {
                        temperature: chatOptions.temperature || 0.35,
                        max_output_tokens: chatOptions.max_tokens || 256,
                        response_mime_type: "application/json"
                    },
                    tools: [{
                        functionDeclarations: [GeminiAIFunctionCallDefinition]
                    }]
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.apiKey,
                        "content-type": "application/json",
                    },
                }
            )
            .then(response => {
                return response.data.choices[0].message;
            })
            .catch(error => {
                if (error.response) {
                    console.log("Server responded with status code:", error.response.status);
                    console.log("Response data:", error.response.data);
                } else if (error.request) {
                    console.log("No response received:", error);
                } else {
                    console.log("Error creating request:", error.message);
                }
            });
        if (response) {
            if (response.content) return response.content;
            return chatOptions.schema.parse(JSON.parse(response.function_call.arguments));
        } else {
            throw new Error("Response did not contain valid JSON.");
        }
    }
}
exports.GeminiAI = GeminiAI;
