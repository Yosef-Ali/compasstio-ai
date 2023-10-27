"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatCard from "./chat-card";

interface CardData {
  title: string;
  description: string;
}

interface ChatCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const cardsData: CardData[] = [
  {
    title: 'Science',
    description: `The world's leading journal of original scientific research, publishing innovative discoveries and scientific advances.`,
  },
  {
    title: 'Cell',
    description: 'A weekly journal publishing new and significant findings in the field of molecular cell biology.',
  },
  {
    title: 'The Lancet',
    description: `A weekly medical journal that is one of the world's leading medical journals. It publishes peer-reviewed`,
  },
  {
    title: 'Nature',
    description: 'A weekly journal of science, publishing the finest peer-reviewed research in all fields of science and technology, covering news and analysis of the latest discoveries along',
  },
  {
    title: 'Cell',
    description: 'A weekly journal publishing...',
  },
  {
    title: 'Cell',
    description: 'A weekly journal publishing...',
  },
  {
    title: 'Cell',
    description: 'A weekly journal publishing...',
  },

];



export default function CardRecent() {
  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {cardsData.map(card => (
        <ChatCard
          key={card.title}
          title={card.title}
          description={card.description}
          onClick={() => { }}
        />
      ))}
    </div>
  );
}