import axios from "axios";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import { ChatModel, role } from "../../types/index";
const GeminiAI_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;

interface GeminiAIConstructionOptions {
    apiKey?: string;
    PROJECT_ID?: string;
    GOOGLE_AUTH_TOKEN?: string;
}

interface messageOption {
    role: role;
    content: string;
    name?: string;
}
[];

interface GeminiAIChatOptions {
    model?: ChatModel;
    role?: role;
    max_tokens?: number;
    temperature?: number;
    prompt?: string;
    messages?: messageOption;
}

interface chatWithFunctionOptions {
    model?: ChatModel;
    role?: role;
    max_tokens?: number;
    temperature?: number;
    prompt?: string;
    functions?: object | Array<object>;
    messages?: messageOption;
    function_call?: string;
}

interface ZodSchemaResponseOptions<S extends z.ZodTypeAny> {
    model?: ChatModel;
    role?: role;
    max_tokens?: number;
    temperature?: number;
    prompt: string;
    schema: S;
}

interface chatWithFunctionReturnOptions {
    content: string;
    function_call: {
        name: string;
        arguments: string;
    };
}

interface GeminiAIChatReturnOptions {
    content: string;
}

export class GeminiAI {
    apiKey: string;
    PROJECT_ID: string;
    GOOGLE_AUTH_TOKEN: string;
    constructor(options: GeminiAIConstructionOptions) {
        this.apiKey = options.apiKey || "process.env.GeminiAI_API_KEY" || "";
        this.PROJECT_ID = options.PROJECT_ID || "process.env.GeminiAI_API_KEY" || "";
        this.GOOGLE_AUTH_TOKEN = options.GOOGLE_AUTH_TOKEN || "process.env.GOOGLE_AUTH_TOKEN" || "";
    }

    async chat(chatOptions: GeminiAIChatOptions): Promise<GeminiAIChatReturnOptions> {
        const apiKey = this.apiKey;
        const baseUrl = GeminiAI_url;
        const completeUrl = `${baseUrl}?key=${apiKey}`;
        const response = await axios
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
                            // top_p: 0.85,
                            // top_k: 10,
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
            .then((response) => {
                return response.data.choices;;
            })
            .catch((error) => {
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

    async chatWithFunction(
        chatOptions: chatWithFunctionOptions
    ): Promise<chatWithFunctionReturnOptions> {
        const apiKey = this.apiKey;
        const baseUrl = GeminiAI_url;
        const completeUrl = `${baseUrl}?key=${apiKey}`;
        const response = await axios
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
                        // top_p: 0.85,
                        // top_k: 10,
                        max_output_tokens: chatOptions.max_tokens || 256,
                        response_mime_type: "application/json"
                    },
                    tools: [{
                        functionDeclarations: chatOptions.functions
                        //[
                        //     {
                        //         name: chatOptions.content || "get_current_weather",
                        //         description: "Get the current weather in a given location",
                        //         parameters: {
                        //             type: "object",
                        //             properties: {
                        //                 location: {
                        //                 type: "string",
                        //                 description: "The city and state, e.g. San Francisco, CA or a zip code e.g. 95616"
                        //                 }
                        //             },
                        //             required: [
                        //                 location
                        //             ]
                        //         }
                        //     }
                        // ]
                    }]
                },
                {
                    headers: {
                        "content-type": "application/json",
                    },
                }
            )
            .then((response) => {
                return response.data.choices;
            })
            .catch((error) => {
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

    async generateEmbeddings(resp): Promise<any> {
        const model = "text-embedding-004";
        const response = await axios
            .post(
                `https://us-central1-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/us-central1/publishers/google/models/${model}:predict`,
                {
                    instances: resp
                    //[
                    //     { 
                    //         content: "TEXT",
                    //         task_type: "TASK_TYPE",
                    //         title: "TITLE"
                    //     },
                    // ]
                    ,
                    // parameters: {
                    //     autoTruncate: true,
                    //     outputDimensionality: 800
                    // }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.GOOGLE_AUTH_TOKEN}`,
                        "content-type": "application/json",
                    },
                }
            )
            .then((response) => {
                return response.data.data;
            })
            .catch((error) => {
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

    async zodSchemaResponse<S extends z.ZodTypeAny>(
        chatOptions: ZodSchemaResponseOptions<S>
    ): Promise<S> {
        const jsonSchema = zodToJsonSchema(chatOptions.schema, { $refStrategy: "none" });
        const GeminiAIFunctionCallDefinition = {
            name: "generateSchema",
            description: "Generate a schema based on provided details.",
            parameters: jsonSchema,
        };
        // Remembrer if any field like url or link is not available please create a dummy link based on the following prompt
        const content = `
                        You are a Schema generator that can generate answer based on given prompt and then return the response based on the give schema 
                        Remembrer if any field like url or link is not available please create a dummy link based on the following prompt
                        
                        prompt:
                        ${chatOptions.prompt || ""}
                        `;
        const apiKey = this.apiKey;
        const baseUrl = GeminiAI_url;
        const completeUrl = `${baseUrl}?key=${apiKey}`;
        const response = await axios
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
                        // top_p: 0.85,
                        // top_k: 10,
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
            .then((response) => {
                return response.data.choices[0].message;
            })
            .catch((error) => {
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
