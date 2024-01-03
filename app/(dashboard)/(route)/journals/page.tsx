"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react";

import { useMutation } from "convex/react"
import Wrapper from "../../_components/wrapper"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, Tablets } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import Shell from "../../_components/shell"
import CardRecentJournal from "../../_components/journals/journal-recent";
import CardArchiveJournal from "../../_components/journals/journal-archive";
import TopNav from "../../_components/top-nav";
import RightAside from "../../_components/right-aside";

interface Props {
  page?: 'journals' | 'chat' | 'tasks'
}


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


const JournalsPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const create = useMutation(api.journals.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((journalId) => router.push(`/journals/${journalId}`))

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
        <Wrapper>
          <div className="max-w-xl mx-auto flex flex-col p-12 space-y-3">
            <h2 className="text-lg font-medium">
              Welcome to {user?.fullName}&apos;s eternalvirtueai.com
            </h2>
            <Button onClick={onCreate} className="flex">
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Create a Journal
            </Button>
          </div>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default JournalsPage
