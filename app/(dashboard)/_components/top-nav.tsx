
import { useRouter, usePathname, useParams, redirect } from 'next/navigation'
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { PlusCircle } from 'lucide-react'
import React, { FC } from 'react'
import ItemButton from './item-button'
import { useUser } from "@clerk/clerk-react";
import { Id } from '@/convex/_generated/dataModel'
import TitleJournal from './top-nav/title-journals'

interface Props {
  page?: "chat-with-ai" | "chat-with-groups" | "journals" | "tasks" | "live-sessions"
}

const TopNav: FC<Props> = ({ page }) => {
  const router = useRouter();

  const { journalId } = useParams<{ journalId: Id<"journals"> }>();

  const pathname = usePathname()

  const createJournal = useMutation(api.journals.create);
  const handleCreate = () => {
    const promise = createJournal({ title: "Untitled" }).then((journalId) => {
      router.push(`/journals/${journalId}`)
    })

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  //const pathWithoutId = asPath.replace(`/${query.id}`, '')
  console.log('pathname', pathname.split("/").slice(0, 2).join("/"))
  const Pathname = pathname.split("/").slice(0, 2).join("/")
  console.log('page:', page)

  return (
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" pl-5 pr-5 py-3 md:pr-8 border-b  flex-1 flex  w-full">
          <div className="flex items-center w-full p-1">
            <div className="flex text-xl line-clamp-1">
              {/* <span className="flex flex-1 outline-none max-w-fit rounded-md border-none focus:ring-0 text-h1 cursor-pointer p-2 line-clamp-1">Untitle</span>
              <input type="text" className="flex flex-1 px-2 w-full overflow-ellipsis whitespace-nowrap outline-none max-w-fit rounded-md border-none focus:ring-0 !p-0 !m-0 text-h1 cursor-pointer" /> */}
              {/* {!journalId ? "Untitled" : <Title journalId={journalId} />} */}
              {
                page === 'chat-with-ai' ? (`!journalId ? "Untitled" : <TitleChatWithAI journalId={journalId} />`) :
                  page === 'chat-with-groups' ? (`!journalId ? "Untitled" : <TitleChatWithGroups journalId={journalId} />`) :
                    page === 'journals' ? (!journalId ? "Untitled" : <TitleJournal journalId={journalId} />) :
                      page === 'tasks' ? (`!taskId ? "Untitled" : <TitleTasks taskId={taskId} />`) :
                        page === 'live-sessions' ? (`!liveSessionId ? "Untitled" : <TitleLiveSections liveSessionId={liveSessionId} />`)
                          : "Untitled"
              }

            </div>
          </div>
          {/* <div className="flex justify-end space-x-2">
            <Button className='flex bg-purple-500'>NewProject</Button>
          </div> */}
          {Pathname === '/journals' ? (
            <div className="flex shrink-0">
              <ItemButton
                onClick={handleCreate}
                label="New Journal"
                icon={PlusCircle}
              />
            </div>) :
            Pathname === '/tasks' ? (
              <div className='flex shrink-0'>
                <ItemButton
                  onClick={() => { }}
                  label="New Task"
                  icon={PlusCircle}
                />
              </div>
            ) :
              Pathname === '/live-sessions' ? (
                <div className='flex shrink-0'>
                  <ItemButton
                    onClick={() => { }}
                    label="New Live Session"
                    icon={PlusCircle}
                  />
                </div>
              ) :
                Pathname === '/chat-with-ai' ? (
                  <div className='flex shrink-0'>
                    <ItemButton
                      onClick={() => { }}
                      label="New Chat"
                      icon={PlusCircle}
                    />
                  </div>
                ) :
                  Pathname === '/chat-with-groups' ? (
                    <div className='flex shrink-0'>
                      <ItemButton
                        onClick={() => { }}
                        label="New Chat"
                        icon={PlusCircle}
                      />
                    </div>
                  ) :
                    null
          }
          {/* <NewButton onClick={onCreate} entity={page || "untitled"} /> */}
        </div>
      </div>
    </div>
  )
}

export default TopNav