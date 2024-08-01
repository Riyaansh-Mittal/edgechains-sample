import { GeminiAI } from "@arakoodev/edgechains.js/gemini";
const path = require("path");
import Jsonnet from "@arakoodev/jsonnet";

const jsonnet = new Jsonnet();
const secretsPath = path.join(__dirname, "../../jsonnet/secrets.jsonnet");
const geminiAIApiKey = JSON.parse(jsonnet.evaluateFile(secretsPath)).gemini_api_key;
const project_id = JSON.parse(jsonnet.evaluateFile(secretsPath)).project_id;
const google_auth_token = JSON.parse(jsonnet.evaluateFile(secretsPath)).google_auth_token;

const llm = new GeminiAI({
    apiKey: geminiAIApiKey, PROJECT_ID: project_id, GOOGLE_AUTH_TOKEN:google_auth_token
});

function getEmbeddings() {
    return (content: any) => {
        console.log("Content:", content);
        const embeddings = llm.generateEmbeddings(content).then((res: any) => {
            return JSON.stringify(res);
        });
        return embeddings;
    };
}

module.exports = getEmbeddings;
