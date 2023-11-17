"use client";

import { ElementRef, useRef, useState } from "react";
import { CalendarCheck2Icon, CalendarClock, ImageIcon, Loader2Icon, LoaderIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import TextareaAutosize from "react-textarea-autosize";

//import { useCoverImage } from "@/hooks/use-cover-image";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { IconPicker } from "./components/icon-picker";
import { ComboboxPopover } from "../popover";
//import { TaskStatusPopover } from "./components/popover/tasks-popover";
import { useTaskStatus } from "@/app/hooks/use-task-status";
import { TaskStatusPopover } from "./components/tasks-popover/tasks-popover";
import { DatePickerDemo } from "@/components/date-picker";

//import { IconPicker } from "../app/(dashboard)/_components/tasks/components/icon-picker";

interface ToolbarProps {
  initialData: Doc<"tasks">;
  preview?: boolean;
};


export const ToolbarTasks = ({
  initialData,
  preview
}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);



  const update = useMutation(api.tasks.update);


  //const removeIcon = useMutation(api.tasks.removeIcon);
  //const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    const newTitle = value || "Untitled";

    setValue(newTitle);
    update({
      id: initialData._id,
      title: newTitle
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
    });
  };



  return (
    <div className="max-w-3xl flex flex-col items-start px-12 ">
      <div className="flex flex-col items-start space-y-2 w-full">
        {isEditing && !preview ? (
          <TextareaAutosize
            ref={inputRef}
            onBlur={disableInput}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(e) => onInput(e.target.value)}
            className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none "
          />
        ) : (
          <div
            onClick={enableInput}
            className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          >
            {initialData.title}
          </div>
        )}
        {/* {!initialData.icon && !preview && (
          // <IconPicker asChild onChange={onIconSelect}>
          //   <Button
          //     className="text-muted-foreground text-xs"
          //     variant="outline"
          //     size="sm"
          //   >
          //     <Smile className="h-4 w-4 mr-2" />
          //     Add icon
          //   </Button>
          // </IconPicker>
          <Button className="text-muted-foreground text-xs" variant="outline" size="sm">
            <LoaderIcon className="w-4 h-4 mr-2" />
            <span>Status</span>
          </Button>
        )} */}

        <TaskStatusPopover />
        <DatePickerDemo />

      </div>
    </div>




  )
}