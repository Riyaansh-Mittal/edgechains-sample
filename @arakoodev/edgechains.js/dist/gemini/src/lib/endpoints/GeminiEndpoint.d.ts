import { z } from "zod";
import { ChatModel, role } from "../../types/index";

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

export declare class GeminiAI {
    apiKey: string;
    constructor(options: GeminiAIConstructionOptions);
    chat(chatOptions: GeminiAIChatOptions): Promise<GeminiAIChatReturnOptions>;
    chatWithFunction(chatOptions: chatWithFunctionOptions): Promise<chatWithFunctionReturnOptions>;
    generateEmbeddings(resp: any): Promise<any>;
    zodSchemaResponse<S extends z.ZodTypeAny>(chatOptions: ZodSchemaResponseOptions<S>): Promise<S>;
}
export {};