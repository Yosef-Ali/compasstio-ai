"use client";

import React from 'react';
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "@/components/toolbar";
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface JournalIdPageProps {
  params: {
    journalId: Id<"journals">;
  };
};


interface InitialData {
  _id: Id<"journals">;
  _creationTime: number;
  content?: string | undefined;
  coverImage?: string | undefined;
  icon?: string | undefined;
  title: string;
  userId: string;

}

interface JournalsSinglePageProps {
  initialData: InitialData;
  onChange: (content: string) => void;
  initialContent: string;
  editable?: boolean;
}

const JournalsSinglePage = ({
  params }: JournalIdPageProps) => {

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const journal = useQuery(api.journals.getById, {
    journalId: params.journalId
  });

  const update = useMutation(api.journals.update);

  const onChange = (content: string) => {
    update({
      id: params.journalId,
      content
    });
  };

  if (journal === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto p-12">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (journal === null) {
    return <div>Not found</div>
  }

  // Component logic

  return (

    <div className="max-w-3xl flex flex-col p-12 space-y-3">
      <Toolbar initialData={journal} />
      <Editor
        onChange={onChange}
        initialContent={journal.content}
        editable
      />
    </div>
  );
};

export default JournalsSinglePage;
