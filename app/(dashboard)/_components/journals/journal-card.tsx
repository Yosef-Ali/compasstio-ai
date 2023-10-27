"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import ChatCard from "../chat-with-ai/chat-card";

interface CardData {
  title: string;
  description: string;
}

interface ChatCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

// const cardsData: CardData[] = [
//   {
//     title: 'Science',
//     description: `The world's leading journal of original scientific research, publishing innovative discoveries and scientific advances.`,
//   },
//   {
//     title: 'Cell',
//     description: 'A weekly journal publishing new and significant findings in the field of molecular cell biology.',
//   },
//   {
//     title: 'The Lancet',
//     description: `A weekly medical journal that is one of the world's leading medical journals. It publishes peer-reviewed`,
//   },
//   {
//     title: 'Nature',
//     description: 'A weekly journal of science, publishing the finest peer-reviewed research in all fields of science and technology, covering news and analysis of the latest discoveries along',
//   },
//   {
//     title: 'Cell',
//     description: 'A weekly journal publishing...',
//   },
//   {
//     title: 'Cell',
//     description: 'A weekly journal publishing...',
//   },
//   {
//     title: 'Cell',
//     description: 'A weekly journal publishing...',
//   },

// ];

// const ChatCard = ({ title, description, onClick }: ChatCardProps) => {
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between">
//           <CardTitle className="text-lg">{title}</CardTitle>
//           <button className="text-gray-500" onClick={onClick}>
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//             </svg>
//           </button>
//         </div>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//     </Card>
//   );
// }

export default function CardRecent() {
  const Journals = useQuery(api.journals.get)

  console.log("Journals:", Journals);

  // useEffect(() => {
  //   console.log("Journals:", Journals);
  // }, [Journals]);


  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {Journals && Journals.map(journal => (
        <ChatCard
          key={journal._id}
          title={journal.title}
          description={journal.title}
          onClick={() => { }}
        />
      ))}
    </div>
  );
}