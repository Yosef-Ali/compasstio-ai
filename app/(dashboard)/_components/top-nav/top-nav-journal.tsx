'use client'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import ItemButton from "../item-button";
import { PlusCircle } from "lucide-react";
import useCreateJournal from "@/app/hooks/useCreateJournal";

interface TitleProps {
  journalId?: Id<"journals">;
}

const TopNavJournals = () => {
  const { journalId } = useParams<{ journalId: Id<"journals"> }>();
  const { createJournal } = useCreateJournal(journalId)


  let journal = journalId ? useQuery(api.journals.getById, { journalId }) : null;

  const handleCreateJournal = () => {
    createJournal()
  };

  return (
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" pl-5 pr-5 py-3 md:pr-8 border-b  flex-1 flex  w-full">
          <div className="flex items-center w-full p-1">
            <div className="flex text-xl line-clamp-1">{journal?.title || "Untitled"}</div>
          </div>
          <div className="flex shrink-0 items-center">
            <ItemButton
              onClick={handleCreateJournal}
              label="New Journal"
              icon={PlusCircle}
            />
          </div>
        </div>
      </div>
    </div>
  );

};

export default TopNavJournals;

