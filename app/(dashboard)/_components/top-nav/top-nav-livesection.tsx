
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useParams } from "next/navigation";

import SearchBar from "@/components/search";
import { useFormattedTime } from "@/lib/formated-time";
import { OperationsMenu } from "@/components/operations-menu-live-sessions";
import { useEffect, useState } from "react";

const TopNavLiveSections = () => {
  const { id } = useParams<{ id: Id<"users"> }>();

  let friendInfo = id ? useQuery(api.users.getFriend, { id: id }) : null;


  const formatted = useFormattedTime(friendInfo?._creationTime || 0);

  return <>
    <div className="sticky top-0 z-40 bg-background">
      <div className="w-full">
        <div className=" px-5 py-3 md:px-6 border-b flex-1 flex ">
          <div className="flex items-center w-full p-1">
            <div className="flex-1">
              <div className="flex items-center">
                {friendInfo && <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friendInfo?.avatarUrl} />
                    <AvatarFallback>YA</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-shrink-0">
                    <div className="text-card-foreground">{friendInfo?.name}</div>
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
            <OperationsMenu />
          </div>
        </div>
      </div>
    </div >
  </>;
};

export default TopNavLiveSections;

