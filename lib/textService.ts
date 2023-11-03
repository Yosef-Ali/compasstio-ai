import { TextServiceClient } from "@google-cloud/text-service";
import { GoogleAuth } from "google-auth-library";

const API_KEY = process.env.API_KEY;
const MODEL_NAME = "models/text-bison-001";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

export async function generateText(prompt: string) {
  try {
    const result = await client.generateText({
      modelId: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    const answer = result[0]?.text;
    if (answer) {
      return answer;
    } else {
      throw new Error("No text generated");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
