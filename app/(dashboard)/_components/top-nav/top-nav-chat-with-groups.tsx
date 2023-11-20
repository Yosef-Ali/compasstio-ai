import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ItemButton from "../item-button";
import { useParams } from "next/navigation";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import SearchBar from "@/components/search";

interface TitleProps {
  groupId: Id<"groups">;

}

const TitleChatWithGroups = () => {

  const { groupId } = useParams<{ groupId: Id<"groups"> }>();
  //const { createJournal } = useCreateJournal(journalId)


  //let journal = journalId ? useQuery(api.journals.getById, { journalId }) : null;

  // const handleCreateJournal = () => {
  //   createJournal()
  // };


  //const group = useQuery(api.groups.getById, { groupId: groupId });

  return <>
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" pl-5 pr-5 py-3 md:pr-8 border-b  flex-1 flex  w-full">
          <div className="flex items-center w-full p-1"><div className="flex-1">
            <div className="flex items-center">
              {/* Avatar component */}
              <Avatar className="w-10 h-10">
                <AvatarImage src="dummy-avatar-url" /> {/* Placeholder for avatar URL */}
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>

              <div className="ml-4 flex-shrink-0">
                <div className="text-card-foreground">Dummy Group Name</div> {/* Placeholder for group name */}
                <div className="text-muted-foreground text-sm">last seen 10 minutes ago</div> {/* Placeholder for group description */}
              </div>
            </div>
          </div>
          </div>
          <div className="flex shrink-0 items-center mr-4 w-[300px]">
            <SearchBar />
          </div>
          <div className="flex shrink-0 items-center">
            <ItemButton
              // onClick={handleCreate}
              label="More"
              icon={MoreHorizontal}
            />
          </div>
        </div>
      </div>
    </div>

  </>;

};

export default TitleChatWithGroups;
