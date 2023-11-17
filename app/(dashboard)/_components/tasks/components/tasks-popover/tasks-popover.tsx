"use client"

import * as React from "react"
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LoaderIcon,
  LucideIcon,
  XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { taskStatus } from "@/config/popoversConfige"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"

type Status = {
  value: string
  label: string
  icon: React.ElementType<any>;
}


export function TaskStatusPopover() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status>()
  const { taskId } = useParams<{ taskId: Id<"tasks"> }>();
  const initialData = useQuery(api.tasks.getById, { taskId })

  const updateTaskStatus = useMutation(api.tasks.update);

  const TaskStatus = taskStatus.find((status) => initialData?.status === status.value);



  React.useEffect(() => {
    if (initialData?.status !== null) {
      if (typeof TaskStatus === 'undefined') {
        // Handle the case where TaskStatus is undefined
        return;
      }

      setSelectedStatus(TaskStatus);
    }
  }, [taskId, initialData?.status]);

  React.useEffect(() => {
    updateTaskStatus({
      id: taskId,
      status: selectedStatus?.value.toString()
    })
  }, [selectedStatus])


  return (
    <div className="flex items-center space-x-4">
      <LoaderIcon className="w-4 h-4" />
      <p className="text-sm text-muted-foreground">Status</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[280px] justify-start"
          >
            {selectedStatus ? (
              <>
                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedStatus.label}
              </>
            ) : (
              <>
                + Set status
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {taskStatus.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      setSelectedStatus(item);
                      setOpen(false);
                    }}
                  >
                    <item.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.value === selectedStatus?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
