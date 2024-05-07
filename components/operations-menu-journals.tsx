"use client"

import { useMutation } from "convex/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Icons } from "@/components/icons"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useDeleteJournal from "@/app/hooks/useDeleteJournal";
import { useRouter } from "next/navigation";


interface PostProps {
  id: Id<"journals">;
  identity: string;
}
interface RecentChatOptionsProps {
  id: string;
}

export default function OperationsMenuJournals({ id, identity }: PostProps) {


  if (identity !== "archived") {
    return (
      <RecentJournalOptions
        id={id}

      />
    );
  }

  return (
    <ArchivedJournalOptions
      id={id}

    />
  );
}



function RecentJournalOptions({ id }: RecentChatOptionsProps) {
  const archived = useMutation(api.journals.archiveJournal);
  const onEdit = () => {
  }

  const onArchived = () => {
    archived({
      id: id as Id<"journals">,
    });
  }

  return (

    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="h-4 w-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onArchived}>
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ArchivedJournalOptions({ id }: RecentChatOptionsProps) {
  const router = useRouter();
  const { deleteJournal } = useDeleteJournal(id as Id<"journals">);
  const restore = useMutation(api.journals.restoreJournal);

  const Restore = () => {
    restore({
      id: id as Id<"journals">,
    });
  }

  const onDeleteJournal = async () => {
    await deleteJournal(); // Use await here to ensure the journal is deleted before navigating
    router.push('/journals'); // Navigate to the journal route
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="h-4 w-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={Restore}>
          Restore
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDeleteJournal}>
          Delete Journal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}