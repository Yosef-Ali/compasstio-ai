import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TitleProps {
  groupId: Id<"groups">;

}

const TitleChatWithGroups = ({ groupId }: TitleProps) => {

  //const group = useQuery(api.groups.getById, { groupId: groupId });

  return <>
    <div className="flex-1">
      <div className="flex items-center">
        {/* Avatar component */}
        <Avatar className="w-12 h-12">
          <AvatarImage src="dummy-avatar-url" /> {/* Placeholder for avatar URL */}
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>

        <div className="ml-4 flex-shrink-0">
          <div className="text-card-foreground">Dummy Group Name</div> {/* Placeholder for group name */}
          <div className="text-muted-foreground text-sm">Dummy Group Description</div> {/* Placeholder for group description */}
        </div>
      </div>
    </div>
  </>;

};

export default TitleChatWithGroups;
