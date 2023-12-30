import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ItemButton from "../item-button";
import { useParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import SearchBar from "@/components/search";



const TopNavChatWithAi = () => {

  return <>
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" px-5 py-3 md:pr-6 border-b flex-1 flex ">
          <div className="flex items-center w-full p-1">
            <div className="flex-1">
              <div className="flex items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/avatarAi.svg" />
                </Avatar>
                <div className="ml-4 flex-shrink-0">
                  <div className="text-card-foreground">Chatbot</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex shrink-0 items-center mr-4 w-[300px]">
            <SearchBar />
          </div>
          <div className="flex shrink-0 items-center ">
            <ItemButton
              onClick={() => { }}
              label="New Chat"
              icon={PlusCircle}
            />
          </div>
        </div>
      </div>
    </div>

  </>;

};

export default TopNavChatWithAi;
