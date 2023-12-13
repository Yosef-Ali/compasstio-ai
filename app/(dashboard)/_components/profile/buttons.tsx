import { useActiveMenu } from "@/app/hooks/useActiveProfileMenu";
import { Button } from "@/components/ui/button";

const items = ["Messages", "Journals", "Tasks", "More"];

export function ButtonGroup() {
  const { activeItem, setActiveItem } = useActiveMenu();

  return (
    <div className="grid gap-3 grid-cols-4 my-4">
      {items.map((item) => (
        <Button
          key={item}
          //color={`${activeItem === item ? "primary" : "secondary"}`}
          onClick={() => setActiveItem(item)}
          variant={`${activeItem === item ? "default" : "secondary"}`}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
