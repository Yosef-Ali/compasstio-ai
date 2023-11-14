import { Button } from "@/components/ui/button";

interface NewButtonProps {
  onClick: () => void;
  entity: "chat-with-ai" | "chat-with-groups" | "journals" | "tasks" | "live-sessions" | "untitled"
}

function NewButton({ onClick, entity }: NewButtonProps) {
  const title = `New ${entity}`;

  return (
    <Button onClick={onClick}>
      {title}
    </Button>
  );
}

export default NewButton