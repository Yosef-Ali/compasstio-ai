"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react";
import JournalContainer from "../../_components/journal-containerxx"
import RightAside from "../../_components/right-aside"
import TopNav from "../../_components/top-nav"
import { useMutation } from "convex/react"
import Wrapper from "../../_components/wrapper"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, Tablets } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import Shell from "../../_components/shell"
import CardRecent from "../../_components/chat-with-ai/recent-card";
import CardPinned from "../../_components/chat-with-ai/pinned-card";
import CardRecentJournal from "../../_components/journals/card-journal-recent";
import CardArchiveJournal from "../../_components/journals/card-journal-archive";


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


const JournalsSinglePage = () => {
  const router = useRouter();
  const { user } = useUser();

  const create = useMutation(api.journals.create);
  console.log('user', user?.fullName)

  const onCreate = () => {
    const promise = create({ title: "Untitled" })
    // .then((journalId) => router.push(`/journals/${journalId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });

  };




  return (
    <>
      <TopNav />
      <Shell>
        {/* <JournalContainer /> */}
        <Wrapper>
          <h2 className="text-lg font-medium">
            Welcome to {user?.fullName}&apos;s Jotion
          </h2>
          <Button onClick={onCreate}>
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Create a note
          </Button>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default JournalsSinglePage
