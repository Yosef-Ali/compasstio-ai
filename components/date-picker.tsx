"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarClock, Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect } from "react"

export function DatePickerDemo() {
  const { taskId } = useParams<{ taskId: Id<"tasks"> }>()
  const initialData = useQuery(api.tasks.getById, { taskId })
  const [date, setDate] = React.useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  )
  const updateDueDate = useMutation(api.tasks.update)

  const selectedNewDate = date?.[Symbol.toPrimitive]('number')

  useEffect(() => {
    // Update due date
    updateDueDate({
      id: taskId,
      dueDate: selectedNewDate
    });
  }, [selectedNewDate, taskId, updateDueDate]);


  return (
    <div className="flex items-center space-x-6">
      <CalendarClock className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground ">Due</span>
      <Popover >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
