"use client"
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react";

interface ItemButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}


const ItemButton = ({
  label,
  icon: Icon,
  onClick
}: ItemButtonProps) => {
  //const { user } = useUser();

  const active = false

  return (
    <>
      <Button className={cn(
        "group  text-sm py-2 px-4 rounded-lg bg-text-white w-full hover:bg-purple-700 bg-purple-500 flex items-center text-white font-medium",
        active && "bg-primary/5 text-white"
      )}
        onClick={onClick}
      >
        <Icon className="mr-2 w-4 h-4" /> {label}
      </Button>
    </>

  )
}

export default ItemButton







