"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadButtonComponent from "@/components/upload-button";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { Id } from '@/convex/_generated/dataModel';
import { Upload } from 'lucide-react';

type AvatarRef = React.RefObject<HTMLDivElement>;


const data = [
  {
    imageUrl: '/example.avif',
    title: 'Title 1',
    description: 'Description 1',
  },
  {
    imageUrl: '/example.avif',
    title: 'Title 2',
    description: 'Description 2',
  },
  {
    imageUrl: '/example.avif',
    title: 'Title 3',
    description: 'Description 3',
  },
];

export default function ProfilePage() {

  const fileInput = useRef<HTMLInputElement>(null);


  const { user } = useUser();

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateAvatar = useMutation(api.users.updateAvatar);
  const userInfo = useQuery(api.users.getUser, { userId: user!.id.toString() });
  const [loading, setLoading] = useState(false);


  async function handleUploadImage() {
    setLoading(true);
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


  // Render the protected profile page



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
            4,189 followers · 4,389 posts
          </p>
          <div className="grid gap-3 grid-cols-4 my-4">
            <Button className="w-full">
              Message
            </Button>
            <Button variant="secondary" className="w-full">
              Call
            </Button>
            <Button variant="secondary" className="w-full">
              Video
            </Button>
            <Button variant="secondary" className="w-full">
              More
            </Button>
            {/* <UploadButtonComponent /> */}
          </div>
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
              <div className="flex flex-col gap-4 w-[400px]">
                {data.map((item) => (
                  <Card key={item.title} className=" p-2" >
                    <div className="flex ">
                      <div className="flex-1">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <h2 className="text-xl font-bold">{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          {/* Add more tab panels here */}
        </div>
      </div>
    </div >
  );
}

