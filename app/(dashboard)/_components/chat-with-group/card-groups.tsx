"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { useFormattedTime } from "@/lib/formated-time";
import { CheckCheckIcon } from "lucide-react";
import { useOnGroupSelect } from "@/app/hooks/use-on-group-select";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CardData {
  _id: Id<"groups">;
  _creationTime: number;
  name: string;
  description: string;
  avatarUrl: string;
}

/**
 * Renders a group card component.
 * 
 * @param _id - The ID of the group.
 * @param name - The name of the group.
 * @param description - The description of the group.
 * @param _creationTime - The creation time of the group.
 * @param avatarUrl - The URL of the group's avatar image.
 */
export function CardGroup({ _id, name, description, _creationTime, avatarUrl }: CardData) {
  // Hook to format the creation time
  const formatted = useFormattedTime(_creationTime);

  // Check if the group is active based on the URL parameter
  const isActive = _id === useParams()._id;

  return (
    // Link to the chat page for the group
    <Link href={`/chat-with-groups/${_id}`} >
      <Card className={`cursor-pointer ${isActive ? 'bg-muted' : ''}`}>
        <CardHeader>
          <div className="flex">
            <div className="flex-1">
              <div className="flex items-center">
                {/* Avatar component */}
                <Avatar className="w-12 h-12">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-shrink-0">
                  <div className="text-lg font-medium">{name}</div>
                  <div className="text-gray-600">{description}</div>
                </div>
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="flex justify-end">
              <div className="flex flex-col h-full justify-between">
                <div className="flex">
                  {/* Check mark icon */}
                  <CheckCheckIcon className="h-5 w-5 mr-1" />
                  <p className="text-sm ">{formatted}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

/**
 * Renders a skeleton loading state for the group card component.
 */
CardGroup.Skeleton = function CardMessageSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}