import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { FolderIcon, TimerIcon } from "lucide-react";
import moment from 'moment';

interface CardData {
  title: string;
  description: string;
  creationTime: string;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

const ChatCard = ({ title, description, creationTime, onClick }: ChatCardProps) => {


  const dateString = moment(creationTime).format('MMMM D, YYYY');
  console.log('dateString', dateString)


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <button className="text-gray-500" onClick={onClick}>
            {/* button code */}
          </button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 pt-0">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FolderIcon />
              <span>Category</span>
            </div>
            <div className="flex items-center">
              <TimerIcon />
              <div>
                <p className="text-sm text-muted-foreground">
                  {dateString}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChatCard;