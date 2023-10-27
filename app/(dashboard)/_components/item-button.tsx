"use client"
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";

interface ItemButtonProps {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}


const ItemButton = ({
  label,
  onClick,
  icon: Icon
}: ItemButtonProps) => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.journals.create);
  const active = false

  const handleCreate = () => {
    const promise = create({ title: "Untitled" })

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };
  return (
    <div
      onClick={handleCreate}
      role="button"
      className={cn(
        "group  text-sm py-2 px-4 rounded-lg bg-text-white w-full hover:bg-purple-700 bg-purple-500 flex items-center text-white font-medium",
        active && "bg-primary/5 text-white"
      )}
    >
      <Icon className="mr-2" />
      {label}</div>
  )
}

export default ItemButton