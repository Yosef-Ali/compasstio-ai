"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Id } from '@/convex/_generated/dataModel';
import { Upload } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import Messages from '../../_components/profile/messages';
import Tasks from '../../_components/profile/tasks';
import { ButtonGroup } from '../../_components/profile/buttons';
import { useActiveMenu } from '@/app/hooks/useActiveProfileMenu';
import Journals from '../../_components/profile/journals';



export default function ProfilePage() {

  const fileInput = useRef<HTMLInputElement>(null);


  const { user } = useUser();

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateAvatar = useMutation(api.users.updateAvatar);
  const userInfo = useQuery(api.users.getUser, { userId: user!.id.toString() });
  const totalJournal = useQuery(api.journals.getTotal)
  const totalGroup = useQuery(api.groups.getTotal)
  const { activeItem } = useActiveMenu();
  const { isLoading } = useConvexAuth()


  async function handleUploadImage() {

    // Get the file object from the file input element
    const file = fileInput.current?.files?.[0];
    if (!file) {
      console.log('No file selected');
      return; // Early return if the file is null
    }

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      body: file,
    });

    const { storageId } = await result.json();

    updateAvatar({
      id: userInfo?._id as Id<"users">,
      storageId: storageId,
    });
  }
  // Define a function to handle the avatar click
  const handleAvatarClick = useCallback(() => {
    // Trigger the file input click
    fileInput.current?.click();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col items-center w-full p-10 gap-4">
        <div className="flex flex-col items-center">
          <input
            type="file"
            ref={fileInput}
            accept="image/*"
            onChange={handleUploadImage}
            style={{ display: 'none' }} // Hide the file input element
          />

          <div className="relative w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>

            {isLoading && <Spinner />}

            <Avatar className="w-full h-full cursor-pointer" >
              <AvatarImage src={userInfo?.avatarUrl} alt={userInfo?.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 bg-gray-300/50 w-full h-full rounded-full justify-center items-center flex">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h2 className="text-center mt-4">
            {userInfo?.name}
          </h2>
          <p className="text-center text-gray-600">
            {totalGroup} followers · {totalJournal} posts
          </p>
          <ButtonGroup />
        </div>
        <div className="profile-content">
          <Tabs defaultValue="Media" className="w-[400px] flex flex-col items-center">
            <TabsList aria-label="Profile tabs" className="mb-1 w-full">
              <TabsTrigger value="Media" className="flex-1">Media</TabsTrigger>
              <TabsTrigger value="Files" className="flex-1">Files</TabsTrigger>
              <TabsTrigger value="Links" className="flex-1">Links</TabsTrigger>
              <TabsTrigger value="Groups" className="flex-1">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="Media">
              <div className="flex flex-col gap-4 w-[450px]">
                <div className="flex flex-col gap-4 w-[450px]">
                  {activeItem === "Messages" && <Messages />}
                  {activeItem === "Journals" && <Journals />}
                  {activeItem === "Tasks" && <Tasks />}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {/* Add more tab panels here */}
        </div>
      </div>
    </div >
  );
}

