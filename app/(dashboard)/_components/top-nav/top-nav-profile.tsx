import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useParams } from "next/navigation";

import SearchBar from "@/components/search";
import { useFormattedTime } from "@/lib/formated-time";
import { OperationsMenu } from "@/components/operations-menu-chat-group";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";


const TitleProfile = () => {

  const { user } = useUser();

  if (!user) return null;


  const userInfo = useQuery(api.users.getUser, { id: user.id.toString() });




  const formatted = useFormattedTime(userInfo?._creationTime || 0);

  return <>
    <div className="sticky top-0 z-40 bg-background">
      <div className="w-full">
        <div className=" px-5 py-3 md:px-6 border-b flex-1 flex ">
          <div className="flex items-center w-full p-1">
            <div className="flex-1">
              <div className="flex items-center">
                {userInfo && <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userInfo?.avatarUrl} />
                    <AvatarFallback>YA</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-shrink-0">
                    <div className="text-card-foreground">{userInfo?.name}</div>
                    <div className="text-muted-foreground text-sm"> {`last seen ${formatted}`}</div>
                  </div>
                </>
                }
              </div>
            </div>
          </div>
          <div className="hidden lg:flex shrink-0 items-center mr-4 w-[300px]">
            <SearchBar />
          </div>
          <div
            className=
            "flex shrink-0 items-center justify-end">
            <OperationsMenu id={user.id} />
          </div>
        </div>
      </div>
    </div >
  </>;
};

export default TitleProfile;
