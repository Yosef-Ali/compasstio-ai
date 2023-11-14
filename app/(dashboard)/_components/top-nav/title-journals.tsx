import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TitleProps {
  journalId: Id<"journals">;
}

const TitleJournal = ({ journalId }: TitleProps) => {

  const journal = useQuery(api.journals.getById, { journalId });

  return (
    <h1 className="text-xl font-semibold">{journal?.title}</h1>
  );

};

export default TitleJournal

