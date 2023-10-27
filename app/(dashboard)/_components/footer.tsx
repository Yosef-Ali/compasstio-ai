
import { ModeToggle } from "@/components/mode-toggle";
import ChatInput from "./chat-input";
import { ChatInputForm } from "./chat-input-test";

export const Footer = () => {
  return (
    <div className="grid grid-cols-12 !bg-transparent" >
      <div className="col-span-8">
        <div className="flex items-center justify-center">
          {/* <ChatInput
            apiUrl={""}
            query='my query'
            name="name"
            type={"conversation"}
          /> */}
          <ChatInputForm />
        </div>
      </div>
      <div className="col-span-4 flex items-center justify-end pr-7 ">
        <div className="">
          <ModeToggle />
        </div>
      </div>
    </div >
  );
};
