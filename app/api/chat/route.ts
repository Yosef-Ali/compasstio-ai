import { HfInference, HfInferenceEndpoint } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";
import { experimental_buildStarChatBetaPrompt } from 'ai/prompts';

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs";

// Create a new Hugging Face Inference instance
//const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);


const endpointUrl = 'https://mg2otmezfmuyqmpt.us-east-1.aws.endpoints.huggingface.cloud';
//const endpointUrl = 'https://khi0hb5ldx8qdg7q.us-east-1.aws.endpoints.huggingface.cloud';
const Hf = new HfInferenceEndpoint(
  endpointUrl,
  process.env.HUGGINGFACE_API_KEY,
);

//const systemPrompt = { role: "system", content: "Based on and inline with the teachings of the bible, please provide a motivating answer that is respectful, compassionate and honest." };


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";



export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const prompt = [
    { role: "system", content: "Based on and inline with the teachings of the bible, please provide a motivating answer that is respectful, compassionate and honest." },
    ...messages,
  ];


  // Initialize a text-generation stream using the Hugging Face Inference SDK
  const response = await Hf.textGenerationStream({
    //model: "OpenAssistant/falcon-7b-sft-top1-696",
    //model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    model: "mistralai/Mistral-7B-Instruct-v0.1",

    inputs: experimental_buildStarChatBetaPrompt(prompt),
    //inputs: experimental_buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: true,
    },
  });

  // Convert the async generator into a friendly text-stream
  const stream = HuggingFaceStream(response, {
    onCompletion: async (completion: string) => {
      const { userId } = auth();
      if (typeof userId === "string") {
        // Use userId as a string


        const messagesContent = messages.map((message: { content: string; }) => message.content);

        console.log("messagesContent", messagesContent);

        await convex.mutation(api.chats.create, {
          prompt: messagesContent[messagesContent.length - 1],
          result: completion,
          userId,
          conversationId: "",
        });
      } else {
        // Handle the case where userId is null or undefined
      }

    },

  });

  //const stream = HuggingFaceStream(response);

  // Respond with the stream, enabling the client to consume the response
  return new StreamingTextResponse(stream);
}
