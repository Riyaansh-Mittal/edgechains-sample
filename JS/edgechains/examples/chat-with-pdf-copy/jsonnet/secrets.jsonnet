// Define variables
local SUPABASE_API_KEY = "supabase secret key here";
local GEMINI_API_KEY = "Gemini api key here";
local SUPABASE_URL = "supabase url here";
local PROJECT_ID = "google cloud project id here";
local GOOGLE_AUTH_TOKEN = "gcloud auth print-access-token";

// Return a JSON object with the secret values
{
    supabase_api_key: SUPABASE_API_KEY,
    supabase_url: SUPABASE_URL,
    gemini_api_key: GEMINI_API_KEY,
    project_id: PROJECT_ID,
    google_auth_token: GOOGLE_AUTH_TOKEN
}
