import path from "path";
import { GeminiAI } from "@arakoodev/edgechains.js/gemini";
import z from "zod";
import Jsonnet from "@arakoodev/jsonnet";
const jsonnet = new Jsonnet();

const secretsPath = path.join(__dirname, "../../jsonnet/secrets.jsonnet");
const geminiAIApiKey = JSON.parse(jsonnet.evaluateFile(secretsPath)).gemini_api_key;
const project_id = JSON.parse(jsonnet.evaluateFile(secretsPath)).project_id;
const google_auth_token = JSON.parse(jsonnet.evaluateFile(secretsPath)).google_auth_token;

const geminiai = new GeminiAI({ apiKey: geminiAIApiKey, PROJECT_ID: project_id, GOOGLE_AUTH_TOKEN:google_auth_token });

const schema = z.object({
    answer: z.string().describe("The answer to the question"),
});

function geminiAICall() {
    return function (prompt: string) {
        try {
            return geminiai.zodSchemaResponse({ prompt, schema }).then((res: any) => {
                return JSON.stringify(res);
            });
        } catch (error) {
            return error;
        }
    };
}

module.exports = geminiAICall;
