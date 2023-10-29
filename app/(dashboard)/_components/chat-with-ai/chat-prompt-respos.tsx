import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserButton } from "@clerk/clerk-react";

interface Props {
  prompt: string
  response: string
}

export default function ChatPromptResponse({ prompt, response }: Props) {

  return (
    <div className="flex flex-col mx-auto space-y-10 max-w-2xl w-full mb-10">
      <div className="flex items-end justify-end mb-4 w-full">
        <div className="flex items-end">
          <div className="px-3 py-2 mr-3 rounded-lg inline-block bg-muted text-gray-800">
            {prompt}
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex items-center">
        <UserButton />
        <div className="flex flex-col items-start ml-3">
          <div className="px-3 py-2 rounded-lg inline-block bg-purple-500 text-white">
            {response}
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-muted"></div>
    </div >
  )
}