"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react";

import { useMutation, useQuery } from "convex/react"

import { Button } from "@/components/ui/button"
import { PlusCircleIcon, Tablets } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import dynamic from "next/dynamic";
import { useMemo } from "react";


import CardRecentJournal from "@/app/(dashboard)/_components/journals/journal-recent";
import CardArchiveJournal from "@/app/(dashboard)/_components/journals/journal-archive";
import Shell from "@/app/(dashboard)/_components/shell";
import TopNav from "@/app/(dashboard)/_components/top-nav";
import Wrapper from "@/app/(dashboard)/_components/wrapper";
import RightAside from "@/app/(dashboard)/_components/right-aside";
import { Id } from "@/convex/_generated/dataModel";



interface JournalIdPageProps {
  params: {
    journalId: Id<"journals">;
  };
};


const tabs = [
  {
    name: 'Recent',
    title: 'Recent',
    content: <CardRecentJournal />
  },
  {
    name: 'Archive',
    title: 'Archive',
    content: <CardArchiveJournal />
  }
];

const JournalsSinglePageLayout = ({
  children
}: {
  children: React.ReactNode;
}
) => {


  return (
    <>
      <TopNav page="journals" />
      <Shell>
        <Wrapper>
          {/* <div className="max-w-3xl flex flex-col p-12 space-y-3">
            <Toolbar initialData={journal} />
            <Editor
              onChange={onChange}
              initialContent={journal.content}
              editable
            />
          </div> */}
          {children}
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default JournalsSinglePageLayout