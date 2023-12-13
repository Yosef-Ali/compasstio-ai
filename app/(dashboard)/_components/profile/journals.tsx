
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { JournalCard } from "./card-profile-journals";


interface Journal extends Doc<"journals"> {
  _id: Id<"journals">;
  description?: string;
  coverImage?: string;
  icon?: string;
  title: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
}


export default function Journals() {
  const journals = useQuery(api.journals.get) as Journal[];
  const { isLoading } = useConvexAuth()

  if (journals === undefined || isLoading) {
    console.log("journals", journals)
    return (
      <div className="space-y-3">
        <JournalCard.Skeleton />
        <JournalCard.Skeleton />
        <JournalCard.Skeleton />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {journals?.map(journal => (
        <JournalCard
          key={journal._id}
          title={journal.title ?? " "}
          description={journal.content ?? " "}
          creationTime={journal._creationTime}
        />
      ))}
    </div>
  );
}