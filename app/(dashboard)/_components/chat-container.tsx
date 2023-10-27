
import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { CardContent } from "@/components/ui/card";
import { chatInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";
import ChatInput from "./chat-input";
import Wrapper from "./wrapper";

interface InfoListProps {
  items: ChatInfo[];
}

const InfoList = ({ items }: InfoListProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="grid items-start ">
      {items.map((item, index) => {
        console.log('item.icon', item.icon)
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.title && (
            <CardContent className="grid ">
              <div className=" flex items-center space-x-4 rounded-md  p-4">
                <Avatar className="bg-purple-100 flex justify-center items-center">
                  <Icon className="h-6 w-6 text-purple-500" />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          )
        );
      })}
    </div>
  );
};

const Intro = () => {
  return (

    <div className="mx-auto flex flex-col items-center px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4 md:items-center">
          <h1 className="text-3xl font-bold text-purple-500">
            Welcome to Chat with AI
          </h1>
          <p className="text-sm text-purple-800 md:text-md md:w-[380px] md:text-center">
            Get started by writing a task and Chat can do the rest. Not sure where to start? Check out the Prompt Library for inspiration.
          </p>
        </div>
        <InfoList items={chatInfoConfig} />
      </div>
    </div>
  );
};

const ChatContainer = () => {
  return (
    <Wrapper>
      <div className="p-[100px] ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias deleniti natus officia, reprehenderit, fuga quidem illo aliquid reiciendis error exercitationem mollitia omnis eaque. Voluptates voluptate, nemo natus deserunt mollitia sed.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat totam obcaecati sed architecto? Dolorem, magnam incidunt excepturi saepe fugiat perspiciatis, rem ea magni, eaque nostrum tempora veritatis sequi facere error?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere quidem reprehenderit numquam, accusantium illo dolor esse sit consequuntur similique! Voluptates assumenda odit voluptatem nihil recusandae facere quas quibusdam accusantium optio.
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit, quaerat? Nobis fuga ullam qui numquam nihil incidunt neque ea voluptatibus accusamus quae, quia laudantium eaque libero nostrum illum nulla recusandae.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, iusto quod modi debitis dolore tenetur repellat eum hic sapiente neque minus perferendis iste ipsa. Quae veniam aliquid aliquam excepturi tenetur.
      </div>
    </Wrapper>
  );
};

export default ChatContainer;

