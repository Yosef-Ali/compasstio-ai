import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Initialize a text-generation stream using the Hugging Face Inference SDK
  const response = await Hf.textGenerationStream({
    model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    inputs: experimental_buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  // Convert the async generator into a friendly text-stream
  const stream = HuggingFaceStream(response, {
    onCompletion: async (completion: string) => {
      const prompt = experimental_buildOpenAssistantPrompt(messages);
      // await convex.query(api.chats.create)({
      //   prompt,
      //   result: completion,
      // });

      // console.log("completion::", completion);
      // console.log(
      //   "completion::",
      //   experimental_buildOpenAssistantPrompt(messages)
      // );
    },
  });

  // Respond with the stream, enabling the client to consume the response
  return new StreamingTextResponse(stream);
}
