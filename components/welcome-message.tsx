import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

interface WelcomeMessageProps {
  userFullName: string | null | undefined;
  onCreate: () => void;
  buttonLabel: string;
}
const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userFullName, onCreate, buttonLabel }) => {
  const welcomeText = userFullName ? `Welcome to ${userFullName}'s shibahumanity.ai` : "Welcome";

  return (
    <div className="max-w-xl mx-auto flex flex-col p-12 space-y-3">
      <h2 className="text-lg font-medium">
        {welcomeText}
      </h2>
      <Button onClick={onCreate} className="flex">
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        {buttonLabel}
      </Button>
    </div>
  );
};

export default WelcomeMessage;